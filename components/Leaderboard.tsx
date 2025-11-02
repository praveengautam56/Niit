import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { db } from '../firebase';

type LeaderboardEntry = {
    uid: string;
    name: string;
    totalScore: number;
};

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const leaderboardRef = db.ref('leaderboard').orderByChild('totalScore');
        
        const listener = (snapshot: firebase.database.DataSnapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sortedData = Object.keys(data)
                    .map(uid => ({
                        uid,
                        name: data[uid].name,
                        totalScore: data[uid].totalScore,
                    }))
                    .sort((a, b) => b.totalScore - a.totalScore); // Sort descending
                setLeaderboardData(sortedData);
            } else {
                setLeaderboardData([]);
            }
            setLoading(false);
        };

        leaderboardRef.on('value', listener);
        return () => leaderboardRef.off('value', listener);
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Leaderboard...</div>;
    }

    return (
        <div className="leaderboard-content">
            {leaderboardData.length > 0 ? (
                <ol className="leaderboard-list">
                    {leaderboardData.map((user, index) => (
                        <li key={user.uid} className="leaderboard-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{user.name}</span>
                            <span className="score">{user.totalScore.toLocaleString()} pts</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>No scores yet. Be the first to complete a quiz!</p>
            )}
        </div>
    );
};

export default Leaderboard;