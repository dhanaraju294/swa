import os
import shutil
import xml.etree.ElementTree as ET
import uuid
import re

ET.register_namespace("", "http://schemas.openxmlformats.org/package/2006/content-types")
ET.register_namespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")

base_dir = "/Users/bokkadhanaraju/Downloads/fixed_project/swa_pptx_unpacked"
slides_dir = os.path.join(base_dir, "ppt", "slides")
rels_dir = os.path.join(slides_dir, "_rels")

def duplicate_slide(src_num, new_num):
    # Copy slide XML
    src_xml = os.path.join(slides_dir, f"slide{src_num}.xml")
    dst_xml = os.path.join(slides_dir, f"slide{new_num}.xml")
    shutil.copy(src_xml, dst_xml)

    # Make shape IDs unique by simply adding 1000 * new_num
    # so if id="3", it becomes id="9003"
    tree = ET.parse(dst_xml)
    root = tree.getroot()
    for el in root.iter():
        if 'id' in el.attrib and el.attrib['id'].isdigit():
            old_id = int(el.attrib['id'])
            el.attrib['id'] = str(old_id + (new_num * 1000))
    tree.write(dst_xml, encoding="UTF-8", xml_declaration=True)

    # Copy slide rels
    src_rel = os.path.join(rels_dir, f"slide{src_num}.xml.rels")
    dst_rel = os.path.join(rels_dir, f"slide{new_num}.xml.rels")
    if os.path.exists(src_rel):
        shutil.copy(src_rel, dst_rel)

def update_presentation_xml(new_nums):
    pres_xml = os.path.join(base_dir, "ppt", "presentation.xml")
    tree = ET.parse(pres_xml)
    root = tree.getroot()
    sldIdLst = root.find(".//{http://schemas.openxmlformats.org/presentationml/2006/main}sldIdLst")
    
    # Get highest id
    highest_id = 0
    for sldId in sldIdLst:
        highest_id = max(highest_id, int(sldId.attrib["id"]))
    
    # We will need the rId we assign in presentation.xml.rels
    # But let's just append them. We'll find highest rId first in rels.
    
    rels_xml = os.path.join(base_dir, "ppt", "_rels", "presentation.xml.rels")
    tree_rels = ET.parse(rels_xml)
    root_rels = tree_rels.getroot()
    highest_rid = 0
    for rel in root_rels:
        rid_str = rel.attrib["Id"].replace("rId", "")
        if rid_str.isdigit():
            highest_rid = max(highest_rid, int(rid_str))
            
    for num in new_nums:
        highest_id += 1
        highest_rid += 1
        new_rid = f"rId{highest_rid}"
        
        # Add to presentation.xml
        new_sldId = ET.Element("{http://schemas.openxmlformats.org/presentationml/2006/main}sldId")
        new_sldId.attrib["id"] = str(highest_id)
        new_sldId.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"] = new_rid
        sldIdLst.append(new_sldId)
        
        # Add to presentation.xml.rels
        new_rel = ET.Element("{http://schemas.openxmlformats.org/package/2006/relationships}Relationship")
        new_rel.attrib["Id"] = new_rid
        new_rel.attrib["Type"] = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide"
        new_rel.attrib["Target"] = f"slides/slide{num}.xml"
        root_rels.append(new_rel)
        
    tree.write(pres_xml, encoding="UTF-8", xml_declaration=True)
    tree_rels.write(rels_xml, encoding="UTF-8", xml_declaration=True)

def update_content_types(new_nums):
    ct_xml = os.path.join(base_dir, "[Content_Types].xml")
    tree = ET.parse(ct_xml)
    root = tree.getroot()
    
    for num in new_nums:
        new_override = ET.Element("{http://schemas.openxmlformats.org/package/2006/content-types}Override")
        new_override.attrib["PartName"] = f"/ppt/slides/slide{num}.xml"
        new_override.attrib["ContentType"] = "application/vnd.openxmlformats-officedocument.presentationml.slide+xml"
        root.append(new_override)
        
    tree.write(ct_xml, encoding="UTF-8", xml_declaration=True)

duplicate_slide(8, 9)
duplicate_slide(8, 10)
update_presentation_xml([9, 10])
update_content_types([9, 10])

# Now update the text of 9 and 10 manually
import edit_slides
replacements_s9 = {
    "MARKET & BUSINESS MODEL": "CURRENT STAGE",
    "Beachhead: College Students": "Base prototype complete",
    "Expansion: Professionals & Organizations\n\nModel: Free core journey + Premium deep-dive modules (Confidence, Communication)\n\nTAM/SAM/SOM: [To be validated]": "Initiating college validation testing → Building personalization engine → Scaling."
}

replacements_s10 = {
    "MARKET & BUSINESS MODEL": "VISION & ASK",
    "Beachhead: College Students": "SWA is building the infrastructure for an inward journey.",
    "Expansion: Professionals & Organizations\n\nModel: Free core journey + Premium deep-dive modules (Confidence, Communication)\n\nTAM/SAM/SOM: [To be validated]": "Our Ask:\nValidation, mentorship, product guidance, and ecosystem network from Eureka."
}

edit_slides.replace_text_in_slide(os.path.join(slides_dir, "slide9.xml"), replacements_s9)
edit_slides.replace_text_in_slide(os.path.join(slides_dir, "slide10.xml"), replacements_s10)

print("Slide 9 and 10 created and mapped successfully.")
