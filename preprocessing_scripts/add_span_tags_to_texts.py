def highlight_citations(ls_text_data, t_text_data, key_data):
    # Iterate through each row of the key data
    for row in key_data:
        ls_corpus_citation = row["Quote in LS"]
        t_text_citation = row["Quote in T Text"]
        start_index = int(row["Start Index"])
        end_index = int(row["End Index"])

        # Apply highlighting to the LS corpus text data
        ls_text_data = ls_text_data[:start_index] + \
                       f'<span class="highlight-ls" data-uid="{row["UID"]}">' + \
                       ls_text_data[start_index:end_index] + \
                       '</span>' + \
                       ls_text_data[end_index:]

        # Apply highlighting to the T Text text data
        t_text_start_index = t_text_data.find(t_text_citation)
        if t_text_start_index != -1:
            t_text_end_index = t_text_start_index + len(t_text_citation)
            t_text_data = t_text_data[:t_text_start_index] + \
                          f'<span class="highlight-t" data-uid="{row["UID"]}">' + \
                          t_text_data[t_text_start_index:t_text_end_index] + \
                          '</span>' + \
                          t_text_data[t_text_end_index:]

    return ls_text_data, t_text_data

def main():
    # Read LS Corpus text data from file
    with open("key_and_data/ls-5-8-complete.txt", "r", encoding="utf-8") as f:
        ls_text_data = f.read()

    # Read T Text text data from file
    with open("key_and_data/t-text-python-cleaned_el_3-25-24.txt", "r", encoding="utf-8") as f:
        t_text_data = f.read()

    # Read key data from JSON file
    import json
    with open("key_and_data/key_indexed.json", "r", encoding="utf-8") as f:
        key_data = json.load(f)

    # Highlight citations in LS Corpus and T Text
    highlighted_ls_text, highlighted_t_text = highlight_citations(ls_text_data, t_text_data, key_data)

    # Write highlighted text to HTML files
    with open("highlighted_ls_text.html", "w", encoding="utf-8") as f:
        f.write(highlighted_ls_text)

    with open("highlighted_t_text.html", "w", encoding="utf-8") as f:
        f.write(highlighted_t_text)

if __name__ == "__main__":
    main()
