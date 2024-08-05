import {UploadType} from "./types";

const step18 = {
    title: 'Brilliant!',
    description:
        'Thank you. We’re all square and your brief is on it’s way to one of our amazing journalists. Check your inbox (and spam folder) for your confirmation and tracking code.',
    id: 'thank-you-message',
    hideBasket: true,
    hidePreviousSteps: true,
    end: true,
    options: [{type: 'button', text: 'Done', end: true}],
};

const step16 = {
    title: 'Please review',
    metaDescription: 'Last step',
    id: 'confirm',
    hideBasket: true,
    request: true,
    moreMargin: true,
    tooltip: "Please ensure everything is correct and accurate to ensure the timely delivery of your content.",
    progressEnd: true,
    options: [
        {
            type: 'basketReview',
        },
        {
            type: 'checkbox',
            required: true,
            id: 'agree-with-terms',
            text: "Agree to Liability - By continuing you agree that all the information you have supplied is accurate and true to the best of your knowledge and you accept full responsibility for its distribution and possible publication.",
            metaDescription: 'Agree with terms',
        },
        {
            type: 'checkbox',
            required: true,
            id: 'agree-with-privacy-policy',
            text: "Agree to Policy - By proceeding you are agreeing to our Terms & Conditions and Privacy Policy on collecting personal and business sensitive information for the purposes of fulfilling your brief.",
            metaDescription: 'Agree with privacy policy'
        },
        {
            type: 'button',
            text: `All done, let's do this`,
            gaId: 'ga-form-complete',
            send: true,
            next: step18,
            continuable: true,
        },
    ],
    progress: 100
};

// SECTION 5 - ABOUT YOU

const step5_2 = {
    title: 'WHY NOT MAKE AN ACCOUNT?',
    description: 'This will mean that you can log back in at any time to check your order.',
    id: 'signup-step',
    metaDescription: 'Account',
    hideIfLoggedIn: true,
    options: [
        {
            type: 'input',
            placeholder: 'Something unique',
            id: 'usernameInput',
            required: true,
            metaDescription: 'Username'
        },
        {
            type: 'input',
            placeholder: 'Something secure',
            id: 'passwordInput',
            required: true,
            metaDescription: 'Password'
        },
        {
            type: 'button',
            text: 'Next',
            next: step16,
            emailNotify: true,
            continuable: true,
            triggerSignup: true
        },
        {
            type: 'skip',
            text: 'Skip',
            next: step16,
        }
    ],
    progress: 80
};

const step5_1 = {
    title: "Great",
    description: "Please let us know a little more about you...",
    metaDescription: "About you",
    id: "about-you-step",
    request: true,
    moreMargin: true,
    tooltip: "We use these to learn more about you and write in a style that suits your brand.",
    weight: 10,
    options: [
        {
            type: "input",
            text: "Full Name.",
            id: "name",
            required: true,
            placeholder: 'e.g. John Doe',
            metaDescription: 'Full Name'
        },
        {
            type: "input",
            text: "Mob/Tel",
            id: "tel",
            placeholder: 'e.g. 123456789',
            metaDescription: 'Mob/Tel'
        },
        {
            type: "input",
            text: "Www",
            id: "site",
            placeholder: 'e.g. www.brief.app',
            metaDescription: 'Website'
        },
        {
            type: "input",
            text: "@Instagram",
            id: "instagram",
            placeholder: 'e.g. @instahandle',
            metaDescription: 'Instagram'
        },
        {
            type: "input",
            text: "@Facebook/Twitter tec",
            id: "other-socials",
            placeholder: 'Any other social media',
            metaDescription: 'Other Socials'
        },
        {
            type: "button",
            text: "Next",
            next: step5_2,
            continuable: true,
        }
    ],
    progress: 70
}


// SECTION 4 - DISTRIBUTION

const step4_3 = {
    title: "Almost Done.",
    description: "Are there any publications you would NOT like your content to be shared with?",
    metaDescription: "Publications to ignore.",
    information: "*We will make sure they are not included in our distribution list.",
    id: "publications-to-ignore-step",
    request: true,
    options: [
        {
            type: "publicationSelect",
            id: "publications-to-ignore",
            text: "This might be a publication you don’t want to be featured in or one you have already spoken with personally.",
            placeholder: 'Type here...',
            metaDescription: 'Publications to ignore'
        },
        {
            type: "button",
            next: step5_1,
            text: "Next",
            continuable: true,
        }
    ],
    progress: 60
}


const journalistAudienceStep = {
    title: 'Thanks',
    description:
        'What type of journalists do you want to contact?',
    metaDescription: 'Audience demographics',
    id: 'journalist-audience-demographics',
    request: true,
    tooltip: "Test tooltip",
    options: [
        {
            type: 'journalist-filters'
        },
        {
            type: 'button',
            text: 'Continue',
            continuable: true,
            analyseJournalists: true,
            next: step4_3,
        },
    ],
    progress: 50
};

// SECTION 3 - AUDIENCE

const step13_2 = {
    title: 'Great',
    description: 'Please enter postcode',
    metaDescription: 'Locality',
    id: 'audience-location-local',
    request: true,
    options: [
        {
            type: 'input',
            id: 'audience-location-local-name',
            placeholder: 'Enter postcode',
            required: true,
            metaDescription: 'Postcode'
        },
        {
            type: 'button',
            text: 'Continue',
            continuable: true,
            next: journalistAudienceStep,
        },
    ]
};

const step13_1 = {
    title: 'Great',
    description: 'Please select cities',
    metaDescription: 'Region',
    id: 'audience-location-regional',
    request: true,
    options: [
        {
            type: 'audience-location-regional-name',
            id: 'audience-location-regional-name',
            placeholder: 'Enter region',
            metaDescription: 'Region'
        },
        {
            type: 'button',
            text: 'Continue',
            continuable: true,
            next: journalistAudienceStep,
        },
    ],
};

const step13 = {
    title: 'Brilliant',
    description: 'Where are your intended readers based?',
    metaDescription: 'Audience location',
    id: 'audience-location',
    request: true,
    tooltip: "This helps us to determine which press you want to target.",
    options: [
        {
            type: 'button',
            text: 'UK Nationwide',
            next: journalistAudienceStep,
            store: true,
            metaDescription: 'UK Nationwide'
        },
        {
            type: 'button',
            text: 'UK Regional',
            next: step13_1,
            store: true,
            metaDescription: 'UK Regional'
        },
    ],
    progress: 45
};


// const step10 = {
//     title: 'Thanks',
//     description:
//         'We need to know a little about your audience demographics? What is the sex of your intended audience?',
//     metaDescription: 'Audience demographics',
//     id: 'audience-demographics',
//     request: true,
//     tooltip: "This helps with both writing style and distribution (if selected).",
//     options: [
//         {
//             type: 'button',
//             text: 'Male',
//             next: step13,
//             store: true,
//             metaDescription: 'Male'
//
//         },
//         {
//             type: 'button',
//             text: 'Female',
//             next: step13,
//             store: true,
//             metaDescription: 'Female'
//         },
//         {
//             type: 'button',
//             text: 'Anyone',
//             next: step13,
//             store: true,
//             metaDescription: 'Anyone'
//         },
//         {
//             type: 'button',
//             text: 'Prefer not to say',
//             next: step13,
//             store: true,
//             metaDescription: 'Prefer not to say'
//         },
//     ],
// };


export const step10_1 = {
    title: 'Upload your release.',
    description: 'Please upload your release.',
    metaDescription: 'release',
    id: 'distribution-upload',
    request: true,
    options: [
        {
            type: 'upload',
            id: 'upload-button',
            metaDescription: 'Upload',
            uploadType: UploadType.release
        },
        {
            type: 'button',
            id: 'upload-continue',
            text: 'Continue',
            triggerUpload: true,
            continuable: true,
            next: step13,
            metaDescription: 'Upload'
        },
    ],
    progress: 40
}

// SECTION 2 - BRIEF

const step2_7 = {
    title: `That's almost it for content`,
    description:
        'Please provide us with links to images, videos or files relating to your story if they are available online.',
    metaDescription: 'Links to media',
    id: 'links-to-media',
    request: true,
    options: [
        {
            type: 'input',
            id: 'media-link-1',
            placeholder: 'website.com/file-1',
            metaDescription: 'Media Link 1'
        },
        {
            type: 'input',
            id: 'media-link-2',
            placeholder: 'website.com/file-2',
            metaDescription: 'Media Link 2'
        },
        {
            type: 'input',
            id: 'media-link-3',
            placeholder: 'website.com/file-3',
            metaDescription: 'Media Link 3'
        },
        {
            type: 'button',
            text: 'Continue',
            continuable: true,
            next: step13,
        },
    ],
    progress: 35
}

const step2_6 = {
    title: 'Got it',
    description:
        'Now you can upload any supporting material such as; existing press release, images, brand documents etc.',
    information:
        'If you would rather send us the link to these available online then add the link in the next step. Supported media files: .PDF, .JPG, .PNG up to 10 MB.',
    metaDescription: 'Supporting material',
    id: 'upload-supporting-material',
    request: true,
    tooltip: "Good, hi-res (over 1MB)  images are really important and can not only bring your story to life but also the press often select what stories to run based on the images. If you aren’t sure what works did you know we offer a creative consultation on our premium package?",
    options: [
        {
            type: 'upload',
            id: 'upload-button',
            metaDescription: 'Upload',
            uploadType: UploadType.supporting_material
        },
        {
            type: 'button',
            id: 'upload-continue',
            text: 'Continue',
            triggerUpload: true,
            continuable: true,
            next: step2_7,
            metaDescription: 'Upload'
        },
    ],
    progress: 30
}

const step2_5 = {
    title: "Sounds Good",
    description: "Anything really important you’d like to make sure we know about?",
    metaDescription: "Important info.",
    information: "*You can upload supporting material or images at the next stage…",
    id: "important-info-step",
    request: true,
    tooltip: "The more you can tell us the better but don’t worry. Your author can usually pull a pretty good press release together from everything you’ve provided so far.",
    options: [
        {
            type: "input",
            id: "important-info",
            text: "This might include stats, new product details, survey results, industry facts or more information etc.",
            placeholder: 'Type here...',
            metaDescription: 'Important Info',
            multiline: true
        },
        {
            type: "button",
            next: step2_6,
            text: "Next",
            continuable: true,
        }
    ],
    progress: 25
}

const step2_4 = {
    title: "Awesome",
    description: "If you want to include a “quote” to help tell the story please enter it below.",
    metaDescription: "Quote.",
    id: "quote-step",
    request: true,
    tooltip: "Quotes are a really useful way to add more personality to your press release and journalists love including them.",
    options: [
        {
            type: "input",
            id: "quote",
            text: "Be sure to include the name and role of the person attributed?",
            placeholder: 'Type here...',
            metaDescription: 'Quote',
            multiline: true
        },
        {
            type: "button",
            next: step2_5,
            text: "Next",
            continuable: true,
        }
    ],
    progress: 20
}

const step2_3 = {
    title: "Great",
    description: "What is the main news hook?",
    metaDescription: "Main news hook.",
    information: "*This should be an elevator pitch.",
    id: "news-hook-step",
    request: true,
    tooltip: "This is the one thing that makes your message stand out to the press that receive it.",
    options: [
        {
            type: "input",
            id: "news-hook",
            text: "What do you want to tell the reader?",
            placeholder: 'Type here...',
            metaDescription: 'News hook',
            multiline: true
        },
        {
            type: "button",
            next: step2_4,
            text: "Next",
            continuable: true,
        }
    ],
    progress: 15
}

const step2_2 = {
    title: "Okay",
    description: "What is the main purpose of your content?",
    metaDescription: "Purpose of content.",
    id: "purpose-of-content-step",
    request: true,
    tooltip: "This will help your author write in the style relevant to your message.",
    weight: 10,
    options: [
        {
            type: 'checkbox',
            id: 'business-news',
            text: 'Business News / Update',
            metaDescription: 'Business News / Update'
        },
        {
            type: 'checkbox',
            id: 'product-launch',
            text: 'Product Launch',
            metaDescription: 'Product Launch'
        },
        {
            type: 'checkbox',
            id: 'promotion',
            text: 'Promotions & Sales',
            metaDescription: 'Promotion & Sales'
        },
        {
            type: 'checkbox',
            id: 'event-invitation',
            text: 'Event Invitation',
            metaDescription: 'Event invitation'
        },
        {
            type: 'checkbox',
            id: 'other',
            text: 'Other… please specify ',
            metaDescription: 'Other'
        },
        {
            type: 'input',
            id: 'other-text',
            text: 'Other...',
            placeholder: 'Type here...',
            metaDescription: 'Other'
        },
        {
            type: 'button',
            next: step2_3,
            text: "Next",
            continuable: true,
        }
    ],
    progress: 10
}

export const step2_1 = {
    title: 'Thanks',
    description: 'What are you looking to create?',
    metaDescription: 'What are you looking to create?',
    id: 'looking-to-create-step',
    request: true,
    moreMargin: true,
    tooltip: 'If you’re not sure select Press Release as a catch all.',
    weight: 10,
    options: [
        {
            type: 'checkbox',
            id: 'press-release',
            text: 'Press Release',
            metaDescription: 'Press Release'
        },
        {
            type: 'checkbox',
            id: 'survey-results-release',
            text: 'Survey Results Release',
            metaDescription: 'Survey Results Release'
        },
        {
            type: 'checkbox',
            id: 'interview',
            text: 'Interview / Q&A',
            metaDescription: 'Interview / Q&A'
        },
        {
            type: 'checkbox',
            id: 'article',
            text: 'Article / Advertorial', // TODO Conditional on not distribution
            conditional: true,
            conditions: ['distributionCheckbox'],
            metaDescription: 'Article / Advertorial'
        },
        {
            type: 'checkbox',
            id: 'event-announcement',
            text: 'Event Announcement',
            metaDescription: 'Event Announcement'
        },
        {
            type: 'checkbox',
            id: 'blog-post',
            text: 'Blog Post',
            metaDescription: 'Blog Post' // TODO Conditional on not distribution
        },
        {
            type: 'checkbox',
            id: 'infographic',
            text: 'Infographic (get in touch)',
            disabled: true,
            metaDescription: 'Infographic'
        },
        {
            type: 'checkbox',
            id: 'other',
            text: 'Other (get in touch)',
            disabled: true,
            metaDescription: 'Other'
        },
        {
            type: 'button',
            text: 'Next',
            next: step2_2,
            continuable: true,
        }
    ],
    progress: 5
}


// SECTION 1 - GETTING STARTED

export const step0 = {
    title: 'Firstly',
    description: 'What services do you require?',
    information: " *Select one or both of the following:",
    metaDescription: "Services you require.",
    id: 'press-release-plan-selection',
    request: true,
    noMargin: true,
    tooltip: "If you select both you will be shown our full service packages",
    options: [
        {
            type: 'deterministicCheckbox',
            store: true,
            id: 'creationCheckbox',
            text: 'Creation',
            payload: false
        },
        {
            type: 'deterministicCheckbox',
            store: true,
            id: 'distributionCheckbox',
            text: 'Distribution',
            payload: false
        },
        {
            type: 'group',
            group: [
                {
                    type: 'package',
                    text: 'Premium',
                    conditions: ['creationCheckbox', 'distributionCheckbox'],
                    next: step2_1,
                    package: true,
                    packageId: 4,
                    packageCost: 199,
                    metaDescription: "Premium Package",
                    store: true,
                },
                {
                    type: 'package',
                    text: 'Professional',
                    conditions: ['creationCheckbox', 'distributionCheckbox'],
                    next: step2_1,
                    package: true,
                    packageId: 7,
                    packageCost: 299,
                    metaDescription: "Professional Package",
                    store: true,
                },
                {
                    type: 'package',
                    text: 'Essential Creation',
                    conditions: ['creationCheckbox'],
                    conditionsExclusive: true,
                    next: step2_1,
                    package: true,
                    packageId: 5,
                    packageCost: 129,
                    metaDescription: "Essential Creation Package",
                    store: true,
                },
                {
                    type: 'package',
                    text: 'Essential Distribution',
                    conditions: ['distributionCheckbox'],
                    conditionsExclusive: true,
                    next: step10_1,
                    package: true,
                    packageId: 6,
                    packageCost: 99,
                    metaDescription: "Essential Distribution Package",
                    store: true,
                }
            ]
        },
    ],
    progress: 0
};

const step0_0 = {
    title: 'LET’S GET STARTED.',
    description: 'Please enter your email to continue...',
    id: 'email-collect-step',
    metaDescription: 'Enter your email.',
    hideIfLoggedIn: true,
    options: [
        {
            type: 'input',
            text: 'Please enter your email address to continue...',
            placeholder: 'e.g. johndoe@email.com',
            id: 'emailInput',
            required: true,
            metaDescription: 'Email address'
        },
        {
            type: 'button',
            text: 'Next',
            next: step0,
            validate: "email", // This is very hacky
            emailNotify: true,
            continuable: true,
        }
    ],
    progress: 0
};

export const checkStep = {
    title: 'Join brief.',
    description: `To check the status of an order you need to create an account!`,
    metaDescription: 'Order ID',
    id: 'order-id',
    hideBasket: true,
    hidePreviousSteps: true,
    options: []
};

export default {
    title: 'Welcome to brief.',
    description:
        'Let’s get started and do something amazing...',
    id: 'action-selection',
    hideBasket: true,
    hidePreviousSteps: true,
    options: [
        // Add start from new brief or continue brief
        {
            type: 'button',
            text: 'Submit New Brief',
            next: step0_0,
        },
        // {type: 'button', text: 'Check Status', next: checkStep},
    ],
};
