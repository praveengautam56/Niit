import React from 'react';
import { BackArrowIcon } from './icons';

interface RscitSyllabusViewProps {
    onBack: () => void;
}

const RscitSyllabusView: React.FC<RscitSyllabusViewProps> = ({ onBack }) => {
    return (
        <div className="syllabus-container">
            <header className="stream-detail-header">
                <button onClick={onBack} className="icon-button" aria-label="Go back">
                    <BackArrowIcon />
                </button>
                <h2 className="stream-detail-title">RS-CIT Syllabus</h2>
            </header>
            <main className="syllabus-content">
                <div className="syllabus-block">
                    <h3 className="syllabus-block-title">Block 1: Introduction to computers (कंप्यूटर का परिचय)</h3>
                    
                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">1. Introduction to Computers (कंप्यूटर का परिचय)</h4>
                        <ul className="syllabus-topic-list">
                            <li>1.1 Introduction (परिचय)</li>
                            <li>1.2 Benefit of Computer System (कंप्यूटर सिस्टम के लाभ)</li>
                            <li>1.3 Hardware & Software (हार्डवेयर और सॉफ्टवेयर)</li>
                            <li>1.4 Uses of Computers (कंप्यूटर का उपयोग)</li>
                        </ul>
                    </div>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">2. Computer system (कंप्यूटर प्रणाली)</h4>
                        <ul className="syllabus-topic-list">
                            <li>2.1 Starting a Computer (कंप्यूटर शुरू करना)</li>
                            <li>2.2 Major Components of Computer System (कंप्यूटर प्रणाली के प्रमुख घटक)</li>
                            <li>2.3 Input Devices (इनपुट डिवाइसेस)</li>
                            <li>2.4 Output Devices (आउटपुट डिवाइसेस)</li>
                            <li>2.5 Input/Output Device (इनपुट/आउटपुट डिवाइस)</li>
                            <li>2.6 Computer Memory (कंप्यूटर मेमोरी)</li>
                            <li>2.7 Checking Computer System Configuration in Windows 11 (Windows 11 में कंप्यूटर सिस्टम की कॉन्फ़िगरेशन जांचना)</li>
                        </ul>
                    </div>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">3. Exploring Your Computer (अपने कंप्यूटर को जानना)</h4>
                        <ul className="syllabus-topic-list">
                            <li>3.1 Operating System (ऑपरेटिंग सिस्टम)</li>
                            <li>3.2 GUI - Desktop (जीयूआई - डेस्कटॉप)</li>
                            <li>3.3 Windows 11: Basic Applications/Utilities (Windows 11: बेसिक एप्लिकेशन/उपयोगिताएँ)</li>
                            <li>3.4 Starting an Application (एप्लिकेशन शुरू करना)</li>
                            <li>3.5 Windows/File Explorer (Windows/फाइल एक्सप्लोरर)</li>
                            <li>3.6 Installing/Uninstalling a Program (प्रोग्राम इंस्टॉल/अनइंस्टॉल करना)</li>
                        </ul>
                    </div>
                </div>

                <div className="syllabus-block">
                    <h3 className="syllabus-block-title">Block 2: Internet and services</h3>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">4. Introduction to Internet (कंप्यूटर का परिचय)</h4>
                        <ul className="syllabus-topic-list">
                            <li>4.1 What is Internet? (इंटरनेट क्या है?)</li>
                            <li>4.2 How to Access Internet (इंटरनेट का उपयोग कैसे करें)</li>
                            <li>4.3 Types of Internet Connections (इंटरनेट कनेक्शन के प्रकार)</li>
                            <li>4.4 Intranet (इंट्रानेट)</li>
                            <li>4.5 Opening a Website (वेबसाइट खोलना)</li>
                            <li>4.6 How to Search the Web (वेब पर खोज कैसे करें)</li>
                            <li>4.7 How to Create Email (ईमेल कैसे बनाएं)</li>
                            <li>4.8 Useful Websites in Rajasthan (राजस्थान की उपयोगी वेबसाइट्स)</li>
                        </ul>
                    </div>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">5. Financial literacy and digital payment applications</h4>
                        <ul className="syllabus-topic-list">
                            <li>5.1 Online Banking (ऑनलाइन बैंकिंग)</li>
                            <li>5.2 Online/Digital Payment Methods & Platforms (ऑनलाइन/डिजिटल भुगतान विधियाँ और प्लेटफ़ॉर्म)</li>
                            <li>5.3 Mobile Payments (मोबाइल भुगतान)</li>
                            <li>5.4 FastTag (फास्टैग)</li>
                        </ul>
                    </div>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">6. Internet Applications (इंटरनेट अनुप्रयोग)</h4>
                        <ul className="syllabus-topic-list">
                            <li>6.1 E-Commerce (ई-कॉमर्स)</li>
                            <li>6.2 Social Networking Sites (सोशल नेटवर्किंग साइट्स)</li>
                            <li>6.3 E-Learning/Online Education (ई-लर्निंग/ऑनलाइन शिक्षा)</li>
                            <li>6.4 Open Resource/Cloud Based Storage (ओपन रिसोर्स/क्लाउड आधारित संग्रहण)</li>
                            <li>6.5 Job Search & Registration (नौकरी खोज और पंजीकरण)</li>
                            <li>6.6 Online Application Submission (ऑनलाइन आवेदन सबमिट करना)</li>
                            <li>6.7 Digital Signing (डिजिटल हस्ताक्षर)</li>
                        </ul>
                    </div>
                    
                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">7. Working with Mobile Devices / Smartphone (मोबाइल डिवाइस / स्मार्टफोन के साथ कार्य करना)</h4>
                        <ul className="syllabus-topic-list">
                            <li>7.1 Handheld Devices Types (हैंडहेल्ड डिवाइस के प्रकार)</li>
                            <li>7.2 Types of Popular Mobile Operating System (लोकप्रिय मोबाइल ऑपरेटिंग सिस्टम के प्रकार)</li>
                            <li>7.3 Configuring Google Play on Smart Phones (स्मार्टफोन में गूगल प्ले सेटअप करना)</li>
                            <li>7.4 Checking Mobile Specification and Configuring Essentials (मोबाइल की विशेषताएँ जाँचना और आवश्यक सेटिंग्स करना)</li>
                            <li>7.5 Sharing Files between Mobiles (Share It) (मोबाइल के बीच फाइल साझा करना (ShareIt))</li>
                            <li>7.6 Using Google Map to Find the Path (रास्ता खोजने के लिए गूगल मेप का उपयोग)</li>
                            <li>7.7 Setting Panel (सेटिंग पैनल)</li>
                            <li>7.8 Useful Apps for Citizens (नागरिकों के लिए उपयोगी ऐप्स)</li>
                            <li>7.9 Other Popular Apps (अन्य लोकप्रिय ऐप्स)</li>
                        </ul>
                    </div>
                </div>

                <div className="syllabus-block">
                    <h3 className="syllabus-block-title">Block 3: Microsoft office and other office tools</h3>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">8. Microsoft Word (माइक्रोसॉफ्ट वर्ड)</h4>
                        <ul className="syllabus-topic-list">
                            <li>8.1 Word Processing and Microsoft Word (वर्ड प्रोसेसिंग और माइक्रोसॉफ्ट वर्ड)</li>
                            <li>8.2 Working With Documents (डॉक्यूमेंट्स के साथ कार्य करना)</li>
                            <li>8.3 Insert Menu, Table and Word Art (इन्सर्ट मेनू, टेबल और वर्ड आर्ट)</li>
                            <li>8.4 Introduction to Paragraph, Alignment, Bullets and Numbering (पैरा, एलाइनमेंट, बुलेट्स और नंबरिंग का परिचय)</li>
                            <li>8.5 Working with Graphs and Charts (ग्राफ और चार्ट्स के साथ कार्य करना)</li>
                            <li>8.6 Working with Various Tabs and Options (विभिन्न टैब्स और विकल्पों के साथ कार्य करना)</li>
                        </ul>
                    </div>

                     <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">9. Microsoft Excel (माइक्रोसॉफ्ट एक्सेल)</h4>
                        <ul className="syllabus-topic-list">
                            <li>9.1 Introduction to MS Excel (एमएस एक्सेल का परिचय)</li>
                            <li>9.2 Concept of Sheet and Workbook (शीट और वर्कबुक की संकल्पना)</li>
                            <li>9.3 Basic Excel (बेसिक एक्सेल कार्य)</li>
                            <li>9.4 Sort & Filter (सॉर्ट और फ़िल्टर करना)</li>
                            <li>9.5 Basic Formulas and Functions (बुनियादी सूत्र और फ़ंक्शंस)</li>
                            <li>9.6 Charts (चार्ट्स)</li>
                        </ul>
                    </div>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">10. MS PowerPoint (एमएस पावरपॉइंट)</h4>
                        <ul className="syllabus-topic-list">
                            <li>10.1 Introduction to MS PowerPoint (एमएस पावरपॉइंट का परिचय)</li>
                            <li>10.2 Creating Slides via Templates, Wizard, Blank Slide (टेम्पलेट, विज़ार्ड और खाली स्लाइड्स द्वारा स्लाइड्स बनाना)</li>
                            <li>10.3 Insert Menu/Tab (इन्सर्ट मेनू/टैब)</li>
                            <li>10.4 Changing Background of a Presentation (प्रेजेंटेशन की पृष्ठभूमि बदलना)</li>
                            <li>10.5 Building a Presentation (प्रेजेंटेशन बनाना)</li>
                            <li>10.6 Slide Show (स्लाइड शो)</li>
                            <li>10.7 Various Tabs and Options (विभिन्न टैब्स और विकल्प)</li>
                        </ul>
                    </div>
                </div>

                <div className="syllabus-block">
                    <h3 className="syllabus-block-title">Block 4: Cyber security and applications of IT</h3>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">11. Cyber Security and Awareness (साइबर सुरक्षा और जागरूकता)</h4>
                        <ul className="syllabus-topic-list">
                            <li>11.1 Types of Cyber Threats (साइबर खतरों के प्रकार)</li>
                            <li>11.2 How to Identify Safe Websites/Portals (सुरक्षित वेबसाइट/पोर्टल की पहचान कैसे करें)</li>
                            <li>11.3 Secure Seals (सुरक्षा मुहरें)</li>
                            <li>11.4 Secure Browsing Habits and Mailing Etiquettes (सुरक्षित ब्राउज़िंग की आदतें और मेलिंग शिष्टाचार)</li>
                            <li>11.5 Social, Legal and Ethical Aspects of IT (आईटी के सामाजिक, कानूनी और नैतिक पक्ष)</li>
                            <li>11.6 Stay Safe from Cyber Fraud (साइबर धोखाधड़ी से सुरक्षित रहें)</li>
                        </ul>
                    </div>
                    
                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">12. Other Office Tools (अन्य ऑफिस टूल्स)</h4>
                        <ul className="syllabus-topic-list">
                            <li>12.1 Google Workspace (गूगल वर्कस्पेस)</li>
                            <li>12.1.1 Google Docs (गूगल डॉक्स)</li>
                            <li>12.1.2 Google Sheets (गूगल शीट्स)</li>
                            <li>12.1.3 Google Forms (गूगल फॉर्म्स)</li>
                            <li>12.1.4 Google Drive (गूगल ड्राइव)</li>
                            <li>12.1.5 Google Slides (गूगल स्लाइड्स)</li>
                            <li>12.1.6 Google Keep (गूगल कीप)</li>
                            <li>12.1.7 Google Calendar (गूगल कैलेंडर)</li>
                            <li>12.2 Open Source Office (ओपन सोर्स ऑफिस)</li>
                            <li>12.2.1 LibreOffice (लिब्रे ऑफिस)</li>
                            <li>12.2.2 WPS Office (डब्ल्यूपीएस ऑफिस)</li>
                            <li>12.3 Online Meeting/Classroom Tools (ऑनलाइन मीटिंग/क्लासरूम टूल्स)</li>
                            <li>12.3.1 Zoom (जूम)</li>
                            <li>12.3.2 Google Meet (गूगल मीट)</li>
                            <li>12.3.3 Microsoft Teams (माइक्रोसॉफ्ट टीम्स)</li>
                            <li>12.4 Image Optimization (इमेज ऑप्टिमाइज़ेशन)</li>
                        </ul>
                    </div>
                    
                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">13. Useful Application of IT (आईटी के उपयोगी अनुप्रयोग)</h4>
                        <ul className="syllabus-topic-list">
                            <li>13.1 CD/DVD Writing/Burning (सीडी/डीवीडी राइटिंग/बर्निंग)</li>
                            <li>13.2 Printing a File using your Computer (कंप्यूटर से फाइल प्रिंट करना)</li>
                            <li>13.3 Saving Data to/From Pen Drive/USB (पेन ड्राइव/यूएसबी में डेटा सहेजना या लेना)</li>
                            <li>13.4 Screen Projection Using LCD Projector/Screen (एलसीडी प्रोजेक्टर/स्क्रीन द्वारा स्क्रीन प्रक्षेपण)</li>
                            <li>13.5 Transfer of Data between PC and Mobile (पीसी और मोबाइल के बीच डेटा ट्रांसफर)</li>
                            <li>13.6 Saving MS Office Document in PDF Format (एमएस ऑफिस दस्तावेज़ को पीडीएफ फॉर्मेट में सहेजना)</li>
                            <li>13.7 Setting up a Restore Point (रिस्टोर पॉइंट सेट करना)</li>
                            <li>13.8 Scan a File/Folder with Antivirus (एंटीवायरस से फाइल/फ़ोल्डर स्कैन करना)</li>
                        </ul>
                    </div>
                </div>

                <div className="syllabus-block">
                    <h3 className="syllabus-block-title">Block 5: IT based services</h3>
                    
                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">14. Exploring Common Citizen Centric Services (सामान्य नागरिक-केंद्रित सेवाओं का अन्वेषण)</h4>
                        <ul className="syllabus-topic-list">
                            <li>14.1 Aadhaar Services (आधार सेवाएँ)</li>
                            <li>14.2 Income Tax Department Services (इनकम टैक्स विभाग की सेवाएँ)</li>
                            <li>14.3 Passport Seva Services (पासपोर्ट सेवा केंद्र की सेवाएँ)</li>
                            <li>14.4 Ticket Booking Services (टिकट बुकिंग सेवाएँ)</li>
                            <li>14.5 National Voters Service Portal (राष्ट्रीय मतदाता सेवा पोर्टल)</li>
                            <li>14.6 LPG Service and Subscription (एलपीजी सेवा और सब्सक्रिप्शन)</li>
                        </ul>
                    </div>

                    <div className="syllabus-chapter">
                        <h4 className="syllabus-chapter-title">15. Major e-Governance Services and Schemes for Citizens of Rajasthan (राजस्थान के नागरिकों के लिए प्रमुख ई-गवर्नेंस सेवाएँ और योजनाएँ)</h4>
                        <ul className="syllabus-topic-list">
                           <li>15.1 e-Governance in Rajasthan (राजस्थान में ई-गवर्नेंस)</li>
                           <li>15.2 Major e-Governance Initiatives in Rajasthan (राजस्थान में प्रमुख ई-गवर्नेंस पहल)</li>
                           <li>15.3 Rajasthan Jan-Aadhaar Yojana (राजस्थान जन-आधार योजना)</li>
                           <li>15.4 Ayushman Bharat Swasthya Beema Yojana (आयुष्मान भारत स्वास्थ्य बीमा योजना)</li>
                           <li>15.5 Single Sign On Facility - SSO (सिंगल साइन ऑन सुविधा - SSO)</li>
                           <li>15.6 Availing Citizen Services (नागरिक सेवाओं का लाभ लेना)</li>
                           <li>15.6.1 e-Mitra Services Through Portal (ई-मित्र पोर्टल के माध्यम से सेवाएँ)</li>
                           <li>15.6.2 Rajasthan Sampark (राजस्थान संपर्क)</li>
                           <li>15.6.3 Jan Soochna Portal (जन सूचना पोर्टल)</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RscitSyllabusView;