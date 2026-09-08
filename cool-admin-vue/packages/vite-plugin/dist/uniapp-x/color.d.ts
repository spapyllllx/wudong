type primaryColor = "emerald" | "green" | "lime" | "orange" | "amber" | "yellow" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink";
type surfaceColor = "slate" | "gray" | "zinc" | "neutral" | "stone" | "soho" | "viva" | "ocean";
export declare function colorPalette(options: {
    primary: primaryColor;
    surface: surfaceColor;
}): {
    [x: string]: string;
};
export {};
