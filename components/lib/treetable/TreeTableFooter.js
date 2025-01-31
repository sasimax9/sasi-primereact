import * as React from 'react';
import { ColumnBase } from '../column/ColumnBase';
import { ColumnGroupBase } from '../columngroup/ColumnGroupBase';
import { RowBase } from '../row/RowBase';
import { mergeProps } from '../utils/Utils';

export const TreeTableFooter = React.memo((props) => {
    const { ptm, ptmo, cx } = props.ptCallbacks;

    const getColumnProp = (column, name) => {
        return ColumnBase.getCProp(column, name);
    };

    const getColumnProps = (column) => {
        return ptmo(ColumnBase.getCProps(column));
    };

    const getColumnPTOptions = (column, key) => {
        return ptmo(getColumnProp(column, 'pt'), key, {
            props: getColumnProps(column),
            parent: props.metaData
        });
    };

    const createFooterCell = (column, index) => {
        const footerCellProps = mergeProps(
            {
                key: column.field || index,
                className: getColumnProp(column, 'footerClassName') || getColumnProp(column, 'className'),
                style: getColumnProp(column, 'footerStyle') || getColumnProp(column, 'style'),
                rowSpan: getColumnProp(column, 'rowSpan'),
                colSpan: getColumnProp(column, 'colSpan')
            },
            getColumnPTOptions(column, 'footerCell')
        );

        return <td {...footerCellProps}>{getColumnProp(column, 'footer')}</td>;
    };

    const createFooterRow = (row, index) => {
        const rowColumns = React.Children.toArray(RowBase.getCProp(row, 'children'));
        const rowFooterCells = rowColumns.map(createFooterCell);
        const footerRowProps = mergeProps(ptm('footerRow'));

        return (
            <tr {...footerRowProps} key={index}>
                {rowFooterCells}
            </tr>
        );
    };

    const createColumnGroup = () => {
        let rows = React.Children.toArray(ColumnGroupBase.getCProp(props.columnGroup, 'children'));

        return rows.map(createFooterRow);
    };

    const createColumns = (columns) => {
        if (columns) {
            const headerCells = columns.map(createFooterCell);
            const footerRowProps = mergeProps(ptm('footerRow'));

            return <tr {...footerRowProps}>{headerCells}</tr>;
        } else {
            return null;
        }
    };

    const hasFooter = () => {
        if (props.columnGroup) {
            return true;
        } else {
            for (let i = 0; i < props.columns.length; i++) {
                if (getColumnProp(props.columns[i], 'footer')) {
                    return true;
                }
            }
        }

        return false;
    };

    const content = props.columnGroup ? createColumnGroup() : createColumns(props.columns);

    if (hasFooter()) {
        const tfootProps = mergeProps(
            {
                className: cx('tfoot')
            },
            ptm('tfoot')
        );

        return <tfoot {...tfootProps}>{content}</tfoot>;
    } else {
        return null;
    }
});

TreeTableFooter.displayName = 'TreeTableFooter';
