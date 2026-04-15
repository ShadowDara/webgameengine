// Generate the HTML File

export interface buildconfig {
    htmlhead: string;
    title: string;
    version: string;
    show_fullscreen_button: boolean;
    entryname: string;
    outdir: string;
    markdown_notes: Paragraph[];
}

export interface Paragraph {
    title: string;
    content: string;
}

export function new_buildconfig(): buildconfig {
    return {
        htmlhead: "",
        title: "My new Game",
        version: "Your Game Version",
        show_fullscreen_button: true,
        entryname: "main",
        outdir: "dist",
        markdown_notes: []
    }
}
