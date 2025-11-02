import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { db } from '../firebase';
import { BasicComputerIcon } from './icons';

interface HomeSlide {
  id: string;
  img: string;
  title: string;
}

const HomeSlider = () => {
    const [slides, setSlides] = useState<HomeSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const sliderRef = db.ref('homeSlider');
        const listener = (snapshot: firebase.database.DataSnapshot) => {
            const slidesData: HomeSlide[] = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    slidesData.push({ id: childSnapshot.key!, ...childSnapshot.val() });
                });
            }
            setSlides(slidesData);
            setLoading(false);
        };
        sliderRef.on('value', listener);

        return () => sliderRef.off('value', listener);
    }, []);

    useEffect(() => {
        if (slides.length > 1) { // Only run the timer if there's more than one slide
            const timer = setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            }, 3000); // Change slide every 3 seconds
            return () => clearTimeout(timer);
        }
    }, [currentIndex, slides.length]);

    if (loading) {
        // A simple placeholder while loading to prevent layout shift
        return <div className="slider-container" style={{ backgroundColor: '#e0e0e0' }}></div>;
    }

    if (slides.length === 0) {
        // Render nothing if no slides are configured in the admin panel
        return null;
    }

    return (
        <div className="slider-container">
            <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {slides.map((slide) => (
                    <div className="slide" key={slide.id}>
                        <img src={slide.img} alt={slide.title} />
                        <div className="slide-overlay"></div>
                        <h3 className="slide-title">{slide.title}</h3>
                    </div>
                ))}
            </div>
            {slides.length > 1 && (
                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


interface Stream {
    name: string;
    icon: React.FC;
}

const streams: Stream[] = [
    { name: 'RS-CIT', icon: BasicComputerIcon },
    { name: 'RS-CFA', icon: BasicComputerIcon },
    { name: 'PGDCA', icon: BasicComputerIcon },
    { name: 'DCA', icon: BasicComputerIcon },
    { name: 'Tally', icon: BasicComputerIcon },
    { name: 'Basic Computer', icon: BasicComputerIcon },
    { name: 'Computer Instructor', icon: BasicComputerIcon },
    { name: 'Information Assistant', icon: BasicComputerIcon },
];

const coursesData = [
    {
        name: 'RS-CIT',
        fullName: '(Rajasthan State Certificate in Information Technology)',
        bgColor: '#f0f4c3',
        details: [
            { icon: '📅', label: 'अवधि', value: '3 महीने' },
            { icon: '💎', label: 'पात्रता', value: 'कोई नहीं (न्यूनतम चौथी उत्तीर्ण)' },
            { icon: '📜', label: 'प्रमाणपत्र', value: 'VMOU द्वारा प्रमाणित' },
        ],
        objective: 'RS-CIT राजस्थान सरकार द्वारा मान्यता प्राप्त डिजिटल साक्षरता कोर्स है, जो किसी भी व्यक्ति को कंप्यूटर के बेसिक ज्ञान से सशक्त करता है। यह कोर्स एक सामान्य उपयोगकर्ता को कंप्यूटर, इंटरनेट, ईमेल, मोबाइल ऐप्स और ई-गवर्नेंस सेवाओं के प्रयोग में सक्षम बनाता है।',
        learn: [
            'MS Office (Word, Excel, PowerPoint)',
            'Internet & Email usage',
            'RKCL Learning Management System (LMS)',
            'E-Mitra, Digital Locker, Online Forms',
            'मोबाइल उपयोग व ऐप्स का परिचय',
        ],
        audience: 'विद्यालय/कॉलेज विद्यार्थी, प्रतियोगी परीक्षा की तैयारी करने वाले युवा, नौकरी की तलाश में लगे अभ्यर्थी, गृहणियाँ एवं वरिष्ठ नागरिक।',
        where: 'सभी मान्यता प्राप्त ज्ञान केन्द्रों पर',
        buttons: [{ text: 'Apply Now', type: 'primary' }]
    },
    {
        name: 'RS-CFA',
        fullName: '(Rajasthan State Certificate in Financial Accounting)',
        bgColor: '#e6f4ea',
        details: [
            { icon: '📅', label: 'अवधि', value: '4 महीने' },
            { icon: '💎', label: 'पात्रता', value: '12वीं उत्तीर्ण' },
            { icon: '📜', label: 'प्रमाणपत्र', value: 'RKCL द्वारा प्रमाणित (इसमें Tally कंपनी द्वारा सर्टिफिकेट प्राप्त करने का विकल्प भी है।)' },
        ],
        objective: <>यह कोर्स छात्रों को <strong>Tally Prime</strong> और <strong>GST आधारित अकाउंटिंग</strong> की संपूर्ण जानकारी देता है। यह व्यावसायिक व वित्तीय क्षेत्र में करियर बनाने की दिशा में एक महत्वपूर्ण कोर्स है।</>,
        learn: [
            'Tally Prime Software',
            'GST & Taxation Concepts',
            'Voucher Entry & Ledger Creation',
            'Inventory Management',
            'Payroll & MIS Reports',
        ],
        audience: 'कॉमर्स स्ट्रीम के विद्यार्थी, जॉब की तैयारी करने वाले युवा, बुक कीपिंग और अकाउंटिंग में रुचि रखने वाले व्यक्ति।',
        where: 'कुछ चुनिन्दा मान्यता प्राप्त ज्ञान केन्द्रों पर',
        buttons: [{ text: 'Apply Now', type: 'primary' }]
    },
    {
        name: 'PGDCA',
        fullName: '(Post Graduate Diploma in Computer Applications)',
        bgColor: '#f3e5f5',
        details: [
            { icon: '📅', label: 'अवधि', value: '1 वर्ष' },
            { icon: '💎', label: 'पात्रता', value: 'स्नातक (Graduation) उत्तीर्ण' },
            { icon: '📜', label: 'प्रमाणपत्र', value: 'University द्वारा मान्यता प्राप्त' },
        ],
        objective: 'PGDCA छात्रों को कंप्यूटर साइंस और एप्लीकेशन का गहन ज्ञान प्रदान करता है। यह कोर्स आईटी क्षेत्र में करियर बनाने के इच्छुक विद्यार्थियों के लिए अत्यंत लाभकारी है।',
        learn: [
            'MS Office Suite (Word, Excel, PPT)',
            'Operating System, DBMS',
            'Web Designing & HTML/CSS',
            'Web Development Using ASP.NET',
            'Accounting with Tally',
        ],
        audience: 'स्नातक विद्यार्थी जो IT में करियर बनाना चाहते हैं या सरकारी/निजी नौकरी की तैयारी कर रहे हैं।',
        where: 'केवल Top Career Computers के झालावाड़ के कैम्पस पर',
        buttons: [
            { text: 'Apply Now', type: 'primary' },
            { text: 'Syllabus', type: 'secondary' }
        ]
    },
    {
        name: 'DCA',
        fullName: '(Diploma in Computer Applications)',
        bgColor: '#ffebdf',
        details: [
            { icon: '📅', label: 'अवधि', value: '1 वर्ष' },
            { icon: '💎', label: 'पात्रता', value: '12वीं उत्तीर्ण' },
            { icon: '📜', label: 'प्रमाणपत्र', value: 'University द्वारा मान्यता प्राप्त' },
        ],
        objective: 'DCA कोर्स विद्यार्थियों को बेसिक से लेकर मिड-लेवल कंप्यूटर एप्लीकेशन का ज्ञान देता है। इसमें ऑफिस ऑटोमेशन, प्रोग्रामिंग व डेटा प्रबंधन सिखाया जाता है।',
        learn: [
            'MS Office Suite (Word, Excel, PPT)',
            'Fundamentals of Computer & Internet',
            'Web Page Designing with HTML/CSS',
            'Introduction to DBMS',
            'DTP',
        ],
        audience: 'कॉलेज स्टूडेंट्स, नौकरी की तलाश में लगे युवा, कंप्यूटर सीखने के इच्छुक आम नागरिक।',
        where: 'केवल Top Career Computers के झालावाड़ के कैम्पस पर',
        buttons: [
            { text: 'Apply Now', type: 'primary' },
            { text: 'Syllabus', type: 'secondary' }
        ]
    }
];

type CourseInfoCardProps = {
    course: typeof coursesData[0];
    onApplyNow: (courseName: string) => void;
};

const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ course, onApplyNow }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="course-card" style={{ backgroundColor: course.bgColor }}>
            <div className="course-card-header">
                <h3>{course.name}</h3>
                <p>{course.fullName}</p>
            </div>
            <div className="course-card-body">
                <ul className="course-details-list">
                    {course.details.map(detail => (
                        <li key={detail.label} className="course-detail-item">
                           {detail.icon} <strong>{detail.label}:</strong> {detail.value}
                        </li>
                    ))}
                </ul>
                <h4 className="course-sub-heading">🚀 कोर्स का उद्देश्य:</h4>
                <p className="course-text">{course.objective}</p>

                <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
                    <h4 className="course-sub-heading">🧠 क्या सीखेंगे:</h4>
                    <ul className="course-learn-list">
                        {course.learn.map(item => <li key={item}>{item}</li>)}
                    </ul>

                    <h4 className="course-sub-heading">👥 उपयुक्त विद्यार्थियों के लिए:</h4>
                    <p className="course-text">{course.audience}</p>
                    
                    <h4 className="course-sub-heading">📍 कहाँ सीखेंगे:</h4>
                    <p className="course-text">{course.where}</p>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="read-more-btn">
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            </div>
            <div className="course-card-buttons">
                 {course.buttons.map(button => (
                    <button 
                        key={button.text} 
                        className={`course-btn ${button.type}`}
                        onClick={() => {
                            const applicableCourses = ['RS-CIT', 'RS-CFA', 'PGDCA', 'DCA'];
                            if (button.text === 'Apply Now' && applicableCourses.includes(course.name)) {
                                onApplyNow(course.name);
                            } else {
                                alert(`${button.text} for ${course.name} is coming soon!`);
                            }
                        }}
                    >
                        {button.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

interface CoursesSectionProps {
    onApplyNow: (courseName: string) => void;
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ onApplyNow }) => {
    return (
        <section className="info-section">
            <h2 className="section-title">NIIIT Campus Courses</h2>
            <div className="course-cards-container">
                {coursesData.map(course => <CourseInfoCard key={course.name} course={course} onApplyNow={onApplyNow} />)}
            </div>
        </section>
    );
};


interface StreamsViewProps {
    onSelectStream: (streamName: string) => void;
    onApplyNow: (courseName: string) => void;
}

const StreamsView: React.FC<StreamsViewProps> = ({ onSelectStream, onApplyNow }) => {
    return (
        <>
            <HomeSlider />
            <div className="quiz-list-section">
                <h2 className="section-title">Choose Your Stream</h2>
                <div className="streams-container">
                    {streams.map((stream) => (
                        <div key={stream.name} className="stream-tile" onClick={() => onSelectStream(stream.name)} role="button" tabIndex={0}>
                            <stream.icon />
                            <h3 className="stream-tile-title">{stream.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <CoursesSection onApplyNow={onApplyNow} />
        </>
    );
};

export default StreamsView;
