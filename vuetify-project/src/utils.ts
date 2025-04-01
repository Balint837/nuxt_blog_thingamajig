export const utils = {
    getTextFromHTML(input: string | HTMLElement): string {
        const element = (typeof input === 'string') ? new DOMParser().parseFromString(input, 'text/html').body : input;
        return element.textContent || '';
    },
    formatText(input: string){
        return input
        // .replace("\n", "<br/>")
        // .replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;")
    }
}