import React from 'react';

const bookCategories = [
    {
        categoryTitle: 'Rs-cit',
        books: [
            {
                title: 'RS-CIT',
                imageUrl: 'https://i.ibb.co/nMvkJSVC/rscit-book-1-thumb.jpg',
                readUrl: 'https://drive.google.com/file/d/12QgJZYq_xyKuWwMQSsT_4GQZ5z0ADPOL/view'
            },
            {
                title: 'RS-CIT',
                imageUrl: 'https://i.ibb.co/kg4xHZFh/rscit-book-2-thumb.jpg',
                readUrl: 'https://drive.google.com/file/d/1DsW_-nIei9ALHyNAZgNo_fom05pViN1a/view'
            },
            {
                title: 'RS-CIT',
                imageUrl: 'https://i.ibb.co/5hskYmgs/niit-book-thumb.jpg',
                readUrl: 'https://drive.google.com/file/d/1G7qouCiHM88OrxiMvkf6I2ZARCz0oEQZ/view?usp=sharing'
            }
        ]
    },
    {
        categoryTitle: 'PGDCA Sem 1',
        books: [
            {
                title: 'डेटाबेस यूज़िंग एम.एस. एक्सेस',
                imageUrl: 'https://i.ibb.co/mFvsHQRJ/sem-1-access.jpg',
                readUrl: 'https://drive.google.com/file/d/1-UVQoW2SFGvUxhJLGK9Nygw3Lxa40HtH/view?usp=sharing'
            },
            {
                title: 'पी.सी. पैकेजेस',
                imageUrl: 'https://i.ibb.co/DPGbYG43/sem-1-pc-package.jpg',
                readUrl: 'https://drive.google.com/file/d/1GgeMwk0UZ-7foGQuhHtthZ2Y_W5bx3Vr/view?usp=sharing'
            },
            {
                title: 'Fundamentals of Computers & Information Technology',
                imageUrl: 'https://i.ibb.co/7x5bxvjX/sem-1-funda.jpg',
                readUrl: 'https://drive.google.com/file/d/1-T5su0-JgPkKjXY3eIHOTxYOXsAY6cUy/view?usp=sharing'
            },
            {
                title: 'Fundamentals of Multimedia',
                imageUrl: 'https://i.ibb.co/vCxRM6vR/sem-1-multimedia.jpg',
                readUrl: 'https://drive.google.com/file/d/1-V0sKG3GfVoS8VFgmrwJOQPPJZyVq9hL/view?usp=sharing'
            }
        ]
    },
    {
        categoryTitle: 'PGDCA Sem 2',
        books: [
            {
                title: 'IT Trends & Technologies',
                imageUrl: 'https://i.ibb.co/mrdqr19p/sem-2-it-trend.jpg',
                readUrl: 'https://drive.google.com/file/d/1-FYT9YGthVAun5aD3JBCY69qTU9dWZyq/view?usp=sharing'
            },
            {
                title: 'Multimedia with CorelDRAW, Premiere & Sound Forge',
                imageUrl: 'https://i.ibb.co/VW3h0JPx/sem2-m-corel.jpg',
                readUrl: 'https://drive.google.com/file/d/1-Hpvx4djmZwu6i6WzZEFE3ai1J7Lg-wD/view?usp=sharing'
            },
            {
                title: 'Financial Accounting with Tally',
                imageUrl: 'https://i.ibb.co/v4G2VHpy/sem2-tally.jpg',
                readUrl: 'https://drive.google.com/file/d/1-HqpnlQZ69p0Bh4t8lg0CHXhU3k2Ah2P/view?usp=sharing'
            },
            {
                title: 'इन्टरनेट एण्ड वेब डिजाइनिंग',
                imageUrl: 'https://i.ibb.co/Y4XxBdcX/sem-2-html.jpg',
                readUrl: 'https://drive.google.com/file/d/1-72ojYc94pUiq1DxS4kzAXSGRuFMoEJt/view?usp=sharing'
            }
        ]
    }
];

const BookView = () => {
    // The state and filtering logic has been removed to always show all categories.

    return (
        <>
            {bookCategories.map((category, catIndex) => (
                <section key={catIndex} className="book-category-section">
                    <h3 className="book-category-title">{category.categoryTitle}</h3>
                    <div className="book-list-container">
                        {category.books.map((book, bookIndex) => (
                             <div className="book-content" key={bookIndex}>
                                <div className="book-item-wrapper">
                                    <div className="book-image-container">
                                         <img src={book.imageUrl} alt={book.title} className="book-image" />
                                    </div>
                                    <h4 className="book-title">{book.title}</h4>
                                </div>
                                <a
                                    href={book.readUrl !== '#' ? book.readUrl : undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`quiz-card-button btn-primary ${book.readUrl === '#' ? 'disabled' : ''}`}
                                    onClick={(e) => { if (book.readUrl === '#') e.preventDefault(); }}
                                    aria-disabled={book.readUrl === '#'}
                                    role="button"
                                >
                                    {book.readUrl === '#' ? 'Coming Soon' : 'Read'}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </>
    );
};

export default BookView;