import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

interface Video {
    id: string;
    title: string;
    embedCode: string;
}

// Reusable helper function to safely parse the src URL from an iframe embed code
const parseSrcFromEmbed = (embedCode: string): string | null => {
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
        url.searchParams.set('rel', '0');
        url.searchParams.set('modestbranding', '1');
        url.searchParams.set('origin', window.location.origin);
        return url.toString();
        
    } catch (e) {
        console.error("Invalid URL found in embed code:", urlString);
        return null;
    }
};

const VideosView = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const videosRef = db.ref('videos');
        const listener = (snapshot: firebase.database.DataSnapshot) => {
            const videosData: Video[] = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    videosData.push({ id: childSnapshot.key!, ...childSnapshot.val() });
                });
            }
            // Show newest videos first
            setVideos(videosData.reverse()); 
            setLoading(false);
        };
        videosRef.on('value', listener);
        return () => videosRef.off('value', listener);
    }, []);

    if (loading) {
        return <p className="placeholder-text">Loading videos...</p>;
    }

    if (videos.length === 0) {
        return (
            <div className="placeholder-text">
                <h3>No Videos Available</h3>
                <p>Check back later for new content.</p>
            </div>
        );
    }

    return (
        <div className="videos-view-container">
            {videos.map((video, index) => {
                const videoSrc = parseSrcFromEmbed(video.embedCode);
                return (
                    <div key={video.id}>
                        <div className="video-item">
                            <h3 className="video-item-title">{video.title}</h3>
                            {videoSrc ? (
                                <div className="video-player-wrapper">
                                    <iframe
                                        src={videoSrc}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                               <p className="placeholder-text">Invalid video embed code.</p>
                            )}
                        </div>
                        {index < videos.length - 1 && <hr className="video-item-divider" />}
                    </div>
                );
            })}
        </div>
    );
};

export default VideosView;