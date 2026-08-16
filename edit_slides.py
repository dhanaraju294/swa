import xml.etree.ElementTree as ET
import sys
import shutil
import os

ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
ET.register_namespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")

def replace_text_in_slide(slide_path, replacements):
    tree = ET.parse(slide_path)
    root = tree.getroot()
    
    for node in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t'):
        if node.text:
            original = node.text
            # Try exact match first
            if original in replacements:
                node.text = replacements[original]
            else:
                # Try partial replacements
                for k, v in replacements.items():
                    if k in original:
                        node.text = node.text.replace(k, v)

    tree.write(slide_path, encoding="UTF-8", xml_declaration=True)

# Replacements
replacements_s2 = {
    "“I keep procrastinating. Why?”": "",
    "“Why did that conversation affect me so much?”": "",
    "“Why do I keep repeating the same pattern?”": "",
    "“I feel overwhelmed. But what is actually happening?”": "We have endless information about the world, and little clarity about ourselves.",
    "We have endless information about the world — and little clarity about ourselves.": ""
}

replacements_s3 = {
    "THE INSIGHT": "THE GAP",
    "Self-awareness isn't a one-time answer.": "Existing solutions are fragmented.",
    "It's a journey.": "",
    "Notice": "Generic Journals",
    "Reflect": "Habit Trackers",
    "Understand": "Therapy",
    "Choose": "",
    "Act": "",
    "Repeated small experiences lead to meaningful patterns over time.": "We lack a continuous, personalized space."
}

replacements_s4 = {
    "THE SOLUTION": "INTRODUCING SWA",
    "Meet SWA — The Inward Journey": "SWA — The Continuous Self-Awareness Journey",
    "A personalized, continuous journey to understand yourself better.": "Small moments of reflection, repeated consistently, to build lasting self-awareness.",
    "Morning": "",
    "Reflection": "",
    "Small Awareness": "",
    "Experiences": "",
    "Evening": "",
    "Pattern": "",
    "Recognition": "",
    "Personalized": "",
    "Insights": "",
    "Each experience takes just 30–90 seconds — small moments that compound into real understanding.": ""
}

replacements_s5 = {
    "WHAT MAKES US DIFFERENT": "HOW IT WORKS",
    "Not another journal.": "The Daily Loop",
    "Not another wellness app.": "",
    "01": "1. Morning",
    "CONTINUOUS": "Reflection",
    "02": "2. Day",
    "PERSONALIZED": "Micro-Experiences",
    "03": "3. Evening",
    "LONGITUDINAL": "Reflection",
    "04": "4. Over Time",
    "PSYCHOLOGICALLY GROUNDED": "Pattern Recognition",
    "05": "",
    "ETHICAL": "",
    "SWA doesn't tell you who you are. It helps you notice who you are becoming.": "A continuous journey of micro-moments."
}

replacements_s6 = {
    "MARKET OPPORTUNITY": "THE INTELLIGENCE",
    "A generation ready to look inward": "Continuous. Personalized. Psychologically Grounded.",
    "BEACHHEAD → EXPANSION": "",
    "College Students": "Psychologically grounded. Human-reviewed. AI-personalized.",
    "Identity development · academic pressure": "",
    "Young Adults → Working Professionals → Organizations → Global Ecosystem": "",
    "$5.6B": "Reflective AI",
    "Mental wellness apps market by 2030": "",
    "16.5%": "",
    "Annual growth in self-improvement tech": "",
    "75% of college students report high stress and low self-clarity.": "",
    "Sources: Grand View Research 2023 · APA College Wellness Report 2022": "",
    "COMPETITIVE GAP": "",
    "SWA": "",
    "Existing apps cluster low — SWA owns continuous + personalized.": ""
}

replacements_s7 = {
    "BUSINESS & SCALE": "COMPETITIVE POSITIONING",
    "Business Model and Growth": "Not a habit tracker. Not a clinical therapist.",
    "01 — FOUNDATION": "",
    "Free / Core Journey": "",
    "Daily reflections and awareness experiences, free for everyone to build the habit.": "",
    "02 — REVENUE": "",
    "Premium Modules": "A reflective intelligence layer for your mind.",
    "Deeper insights, personalized modules and longitudinal pattern analysis.": "",
    "03 — EXPANSION": "",
    "Organizations & Beyond": "",
    "Long-term expansion to broader audiences, schools and workplaces.": "",
    "Sustainable growth — value first, revenue that scales with depth of engagement.": "Intersection of continuous awareness + personalized reflection + longitudinal tracking."
}

replacements_s8 = {
    "Technology has taught us to look outward.": "MARKET & BUSINESS MODEL",
    "SWA helps us look inward.": "Beachhead: College Students",
    "SWA — The Inward Journey": "Expansion: Professionals & Organizations\n\nModel: Free core journey + Premium deep-dive modules (Confidence, Communication)\n\nTAM/SAM/SOM: [To be validated]"
}


base_dir = "/Users/bokkadhanaraju/Downloads/fixed_project/swa_pptx_unpacked/ppt/slides/"

# Apply replacements
replace_text_in_slide(base_dir + "slide2.xml", replacements_s2)
replace_text_in_slide(base_dir + "slide3.xml", replacements_s3)
replace_text_in_slide(base_dir + "slide4.xml", replacements_s4)
replace_text_in_slide(base_dir + "slide5.xml", replacements_s5)
replace_text_in_slide(base_dir + "slide6.xml", replacements_s6)
replace_text_in_slide(base_dir + "slide7.xml", replacements_s7)
replace_text_in_slide(base_dir + "slide8.xml", replacements_s8)

print("Text replacements completed.")
