import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import OldPapersView, { papers } from './OldPapersView';
import RscitSyllabusView from './RscitSyllabusView';
import { BackArrowIcon, OldPaperIcon, QuestionsListIcon, VideoIcon, BookIcon } from './icons';

interface Category {
    name: string;
    key: 'syllabus' | 'oldPapers' | 'quizzes' | 'videos';
    icon: React.FC;
}

const categories: Category[] = [
    { name: 'Syllabus', key: 'syllabus', icon: BookIcon },
    { name: 'Old Papers', key: 'oldPapers', icon: OldPaperIcon },
    { name: 'Quizzes', key: 'quizzes', icon: QuestionsListIcon },
    { name: 'Videos', key: 'videos', icon: VideoIcon },
];

interface StreamDetailViewProps {
    streamName: string;
    onBack: () => void;
}

const StreamDetailView: React.FC<StreamDetailViewProps> = ({ streamName, onBack }) => {
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const streamRef = db.ref(`streams/${streamName}`);
                const snapshot = await streamRef.get();
                
                const counts: Record<string, number> = {};
                if (snapshot.exists()) {
                    categories.forEach(category => {
                        if (streamName === 'RS-CIT' && category.key === 'oldPapers') {
                            counts[category.key] = papers.length;
                        } else if (streamName === 'RS-CIT' && category.key === 'syllabus') {
                             counts[category.key] = 1; // Indicate syllabus exists
                        } else {
                            counts[category.key] = snapshot.child(category.key).numChildren();
                        }
                    });
                } else {
                    // If the stream doesn't exist in Firebase, set defaults
                    categories.forEach(category => {
                        if (streamName === 'RS-CIT' && category.key === 'oldPapers') {
                            counts[category.key] = papers.length;
                        } else if (streamName === 'RS-CIT' && category.key === 'syllabus') {
                            counts[category.key] = 1; 
                        }
                        else {
                            counts[category.key] = 0;
                        }
                    });
                }
                setCategoryCounts(counts);
            } catch (error) {
                console.error("Error fetching category counts:", error);
                const counts: Record<string, number> = {};
                categories.forEach(category => {
                     if (streamName === 'RS-CIT' && category.key === 'oldPapers') {
                        counts[category.key] = papers.length;
                    } else if (streamName === 'RS-CIT' && category.key === 'syllabus') {
                        counts[category.key] = 1;
                    }
                    else {
                        counts[category.key] = 0;
                    }
                });
                setCategoryCounts(counts);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [streamName]);

    const handleCategoryClick = (categoryKey: string) => {
        if (streamName === 'RS-CIT') {
            if (categoryKey === 'syllabus') {
                setActiveCategory('syllabus');
                return;
            }
            if (categoryKey === 'oldPapers') {
                setActiveCategory('oldPapers');
                return;
            }
        }
        alert(`${categoryKey} for ${streamName} is coming soon!`);
    };

    if (activeCategory === 'syllabus') {
        return <RscitSyllabusView onBack={() => setActiveCategory(null)} />;
    }
    if (activeCategory === 'oldPapers') {
        return <OldPapersView streamName={streamName} onBack={() => setActiveCategory(null)} />;
    }

    return (
        <div className="stream-detail-container">
            <header className="stream-detail-header">
                <button onClick={onBack} className="icon-button" aria-label="Go back">
                    <BackArrowIcon />
                </button>
                <h2 className="stream-detail-title">{streamName}</h2>
            </header>
            <main className="category-container">
                {categories.map((category) => (
                    <div key={category.key} className="category-tile" onClick={() => handleCategoryClick(category.key)}>
                        <div className="category-info">
                            <category.icon />
                            <h3 className="category-tile-title">{category.name}</h3>
                        </div>
                        <span className="category-item-count">
                            {loading ? '...' : (categoryCounts[category.key] ?? 0)}
                        </span>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default StreamDetailView;
