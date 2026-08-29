import json
import re
from bs4 import BeautifulSoup


def parse_schedule_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    # Extract student name if present
    student_name_elem = soup.find(id="lblHeader")
    student_name = (
        student_name_elem.get_text(strip=True) if student_name_elem else "Unknown"
    )

    # Dictionary mapping day column indices to dates/days
    headers = soup.select(".rsHorizontalHeaderTable th a.rsDateHeader")
    days_map = {}
    for idx, header in enumerate(headers):
        days_map[idx] = header.get_text(strip=True)

    schedule_data = {"student": student_name, "classes": []}

    # Locate all appointments
    appointments = soup.select(".rsApt")

    for apt in appointments:
        # Determine day column based on parent cell positioning in the table
        parent_td = apt.find_parent("td")
        parent_tr = parent_td.find_parent("tr") if parent_td else None

        day_index = None
        if parent_tr and parent_td:
            day_index = parent_tr.find_all("td", recursive=False).index(
                parent_td
            )

        # Extract time range
        time_elem = apt.select_one(".rsAptContent span.small")
        time_range = time_elem.get_text(strip=True) if time_elem else ""

        # Extract textual content lines
        content_div = apt.select_one(".rsAptContent div:not(.pull-right)")
        lines = (
            [line.strip() for line in content_div.text.split("\n") if line.strip()]
            if content_div
            else []
        )

        # Filter out the time string from lines to find subject details
        text_lines = [l for l in lines if l != time_range]

        course_info = text_lines[0] if text_lines else ""
        room_info = ""
        class_group = ""

        for line in text_lines[1:]:
            if "Lokale(r)" in line:
                room_info = line.replace("Lokale(r) :", "").strip()
            elif not class_group:
                class_group = line

        # Extract homework / tooltips
        homework = []
        tooltip_imgs = apt.select('.pull-right img[data-tooltip]')
        for img in tooltip_imgs:
            raw_tooltip = img.get('data-tooltip', '')
            # Clean HTML tags out of tooltips
            clean_tooltip = re.sub(r'<[^>]+>', ' ', raw_tooltip).strip()
            clean_tooltip = ' '.join(clean_tooltip.split())
            if clean_tooltip:
                homework.append(clean_tooltip)

        schedule_data["classes"].append({
            "day": days_map.get(day_index, f"Column {day_index}"),
            "time": time_range,
            "course": course_info,
            "room": room_info,
            "class_group": class_group,
            "homework_notes": homework
        })

    return json.dumps(schedule_data, indent=2, ensure_ascii=False)

schehtml = open("test.html")
print(parse_schedule_html(schehtml.read()))



