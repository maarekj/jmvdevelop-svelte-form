import filter from 'lodash/filter';
import join from 'lodash/join';

export function cx(...classNames: Array<string | null | undefined>): string {
    return join(
        filter(classNames, (className) => {
            return className != null && className != undefined;
        }),
        ' ',
    );
}
