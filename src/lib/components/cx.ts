import { filter, join } from 'lodash';

export default function cx(...classNames: Array<string | null | undefined>): string {
    return join(
        filter(classNames, (className) => {
            return className != null && className != undefined;
        }),
        ' ',
    );
}
