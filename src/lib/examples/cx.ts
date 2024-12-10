import filter from 'lodash/filter.js';
import join from 'lodash/join.js';

export function cx(...classNames: Array<string | null | undefined>): string {
    return join(
        filter(classNames, (className) => {
            return className != null && className != undefined;
        }),
        ' ',
    );
}
