import React, {useEffect, useState} from "react";
import styles from "./styles.module.css";
import {Accordion, AccordionDetails, AccordionSummary} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Converter} from "showdown";
import {LandingBanner, LandingBannerMapper} from "../Cms/types";
import LandingBannerComponent from "../Cms/LandingBanner/LandingBannerComponent";

export default function FaqComponent() {
    const [entries, setEntries] = useState<{ Question: string, Answer: string }[]>([]);
    const [landingBanner, setLandingBanner] = useState<LandingBanner | null>(null);
    const [landing, setLanding] = useState(false);

    useEffect(() => {

    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CMS_URL}/faq`, {
            method: "GET"
        }).then(response => {
            return response.json();
        }).then(data => {
            const converter = new Converter();
            const l_entries = data.faqEntry;
            l_entries.forEach((entry: { Answer: string }) => {
                entry.Answer = converter.makeHtml(entry.Answer)
            });

            setEntries(data.faqEntry);

            setLandingBanner(LandingBannerMapper(data.landingBanner));
            setLanding(data.landing);
        });
    }, []);

    const structuredData = () => {
        return <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: '{\n' +
                '      "@context": "https://schema.org",\n' +
                '      "@type": "FAQPage",\n' +
                '      "mainEntity": [{\n' +
                '        "@type": "Question",\n' +
                '        "name": "Is brief. a PR agency?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text": "No. brief is not a pr agency. It is an online product offering press release writing services and the best press release distribution."\n' +
                '        }\n' +
                '      }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "How does brief. work?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text": "brief. makes it really simple for you to submit your news to one of our journalists who will write your press release. Once you have approved it brief. will send your press release to targeted media we know will be interested in it."\n' +
                '        }\n' +
                '      }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Which service should I choose?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text": "This depends on what your requirements are. We offer a free DISCOVERY package to help you decide what you want to say and test the water, a PREMIUM package to simply write and distribute your press release for you and a PROFESSIONAL package which offers more services including reporting and media relations. We also offer split packages which include press release writing only and press release distribution only. "\n' +
                '        }\n' +
                '      }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "How much does brief. cost?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text": "DISCOVERY package - Free PREMIUM package - £199 PROFESSIONAL package - £299 CREATION only - £129 DISTRIBUTION - £99"\n' +
                '        }\n' +
                '      }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Is brief. a subscription service?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text":"No. We offer pay as you go packages. We know that most of our users won’t need us every month, so being there when they need us makes it more affordable and less financial commitment."\n' +
                '          }\n' +
                '        }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Do you offer creation only?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text":"Yes. If you have your own distribution all sorted and just want help writing a press release or other important content such as blogs, advertisements etc. then brief. offers an ESSENTIAL CREATON package. "\n' +
                '          }\n' +
                '        }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Do you offer distribution only?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text":"Yes. If you are an expert writer and just want help sending a press release then brief. offers an ESSENTIAL DISTRIBUTION package."\n' +
                '          }\n' +
                '        }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Why do I have to pay upfront?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text":"brief. uses professional journalists to write your press releases and we need to ensure they can be paid. This is why we ask you to pay upfront."\n' +
                '          }\n' +
                '        }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Who writes my press release?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text":"Your press release will be written for you by a professional journalist from within your business sector. For example if you are a restaurant your release will always be written by a food writer. Likewise if your business is a financial product then your press release will be written by a personal finance writer."\n' +
                '          }\n' +
                '        }, {\n' +
                '        "@type": "Question",\n' +
                '        "name": "Who do you send me press release to?",\n' +
                '        "acceptedAnswer": {\n' +
                '          "@type": "Answer",\n' +
                '          "text":"Your press release is sent to the UK and IRE media that you have either suggested in your submission or that we feel will be interested in your story. If there are media you DO NOT want to receive your press release you have the option to let us know if the form."\n' +
                '          }\n' +
                '        }]\n' +
                '    }'
        }}>
        </script>
    }

    return <div style={{paddingBottom: "100px", paddingTop: !landing ? "100px" : ""}}>

        {landingBanner && landing && <LandingBannerComponent banner={landingBanner}/>}

        {structuredData()}

        <h1 className={styles.header}>
            Frequently Asked Questions
        </h1>

        <div className={styles.questions}>
            {entries.map((entry, index) => <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    {entry.Question}
                </AccordionSummary>
                <AccordionDetails>
                    <pre dangerouslySetInnerHTML={{__html: entry.Answer}}/>
                </AccordionDetails>
            </Accordion>)}
        </div>
    </div>
}

