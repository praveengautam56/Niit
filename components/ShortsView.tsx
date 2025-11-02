import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import { db } from '../firebase';

interface Short {
    id: string;
    embedCode: string;
}

const parseAndEnhanceSrc = (embedCode: string): string | null => {
    if (!embedCode || typeof embedCode !== 'string') return null;

    // Step 1: Extract URL from iframe or treat the whole string as a URL
    const srcRegex = /src="([^"]*)"/;
    const match = embedCode.match(srcRegex);
    const urlString = match ? match[1] : embedCode;

    try {
        // Step 2: Extract video ID from various URL formats
        let videoId = null;
        const tempUrl = new URL(urlString);
        
        if (tempUrl.hostname.includes('youtube.com')) {
            if (tempUrl.pathname === '/watch') {
                videoId = tempUrl.searchParams.get('v');
            } else if (tempUrl.pathname.startsWith('/embed/')) {
                videoId = tempUrl.pathname.split('/')[2];
            } else if (tempUrl.pathname.startsWith('/shorts/')) {
                videoId = tempUrl.pathname.split('/')[2];
            }
        } else if (tempUrl.hostname.includes('youtu.be')) {
            videoId = tempUrl.pathname.substring(1).split('?')[0];
        }

        if (!videoId) {
            console.error("Could not determine YouTube video ID from:", urlString);
            return null;
        }

        // Step 3: Reconstruct a clean embed URL with necessary parameters
        const url = new URL(`https://www.youtube.com/embed/${videoId}`);
        url.searchParams.set('enablejsapi', '1');
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');
        url.searchParams.set('loop', '1');
        url.searchParams.set('controls', '0');
        url.searchParams.set('showinfo', '0');
        url.searchParams.set('modestbranding', '1');
        url.searchParams.set('rel', '0');
        url.searchParams.set('origin', window.location.origin);
        // For loop to work, the playlist param needs to be set to the videoId
        url.searchParams.set('playlist', videoId);
        
        return url.toString();
        
    } catch (e) {
        console.error("Invalid URL or embed code:", urlString);
        return null;
    }
};


const ShortsView = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);
    const [shorts, setShorts] = useState<Short[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const shortsRef = db.ref('shorts');
        const listener = (snapshot: firebase.database.DataSnapshot) => {
            const data: Short[] = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    data.push({ id: childSnapshot.key!, ...childSnapshot.val() });
                });
            }
            setShorts(data);
            setLoading(false);
        };
        shortsRef.on('value', listener);

        return () => shortsRef.off('value', listener);
    }, []);

    useEffect(() => {
        if (loading || shorts.length === 0) return;

        videoRefs.current = videoRefs.current.slice(0, shorts.length);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const player = entry.target as HTMLIFrameElement;
                    if (!player || !player.contentWindow) return;

                    if (entry.isIntersecting) {
                        // When video comes into view, ensure it's playing and unmuted
                        player.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
                        player.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
                    } else {
                        // When video goes out of view, pause it
                        player.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
                    }
                });
            },
            {
                root: containerRef.current,
                threshold: 0.75, // Play when 75% visible
            }
        );

        const currentVideoRefs = videoRefs.current;
        currentVideoRefs.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentVideoRefs.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [shorts, loading]);
    
    if (loading) {
        return <p className="placeholder-text">Loading Shorts...</p>;
    }

    if (shorts.length === 0) {
        return (
            <div className="placeholder-text">
                <h3>Coming Soon!</h3>
                <p>This section is under construction.</p>
            </div>
        );
    }

    return (
        <div className="shorts-view-container" ref={containerRef}>
            {shorts.map((short, index) => {
                const videoSrc = parseAndEnhanceSrc(short.embedCode);
                return (
                    <div key={short.id} className="short-item">
                        <div className="video-player-container">
                             {videoSrc ? (
                                <iframe
                                    ref={el => videoRefs.current[index] = el}
                                    src={videoSrc}
                                    title="Shorts Video Player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <p className="placeholder-text" style={{color: '#fff'}}>Invalid video embed code.</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ShortsView;