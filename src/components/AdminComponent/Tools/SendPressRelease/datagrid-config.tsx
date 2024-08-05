import React from "react";
import {Chip} from "@material-ui/core";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";
import {getAudienceAnalysisFilters} from "../../../../app/api";

export const filterTypes = Object.assign({}, ReactDataGrid.defaultProps.filterTypes, {
    'string[]': {
        name: 'string[]',
        emptyValue: "",
        operators: [
            {
                name: 'contains',
                fn: ({value, filterValue}: { value: string[], filterValue: string }) => {
                    // If the filterValue is empty just return all of the rows
                    if (!filterValue) {
                        return true;
                    }

                    const filterValuesSplit = filterValue.replace(" ", "").split(",");

                    // Iterate over each value
                    // Iterate over each filter value
                    // Check if that value contains the filter  value
                    // return true

                    for (const v of value) {
                        for (const fv of filterValuesSplit) {
                            if (fv && v.replace(" ", "").toLowerCase().includes(fv.toLowerCase())) {
                                return true;
                            }
                        }
                    }

                    return false;
                }
            }
        ]
    },
    'select': {
        ...ReactDataGrid.defaultProps.filterTypes.select,
        operators: [
            ...ReactDataGrid.defaultProps.filterTypes.select.operators,
            {
                name: 'array_contains',
                fn: ({value, filterValue}: { value: string[], filterValue: string[] }) => {
                    // If the filterValue is empty just return all of the rows
                    // Iterate over each value
                    // Iterate over each filter value
                    // Check if that value contains the filter  value
                    // return true

                    return value.some(r => filterValue.includes(r));
                }
            }
        ]
    }
});

export const filterValue = [
    {name: "firstName", operator: "contains", type: "string", value: ""},
    {name: "lastName", operator: "contains", type: "string", value: ""},
    {name: "jobTitle", operator: "array_contains", type: "select", value: null},
    {name: "outlet", operator: "array_contains", type: "select", value: null},
    {name: "outletType", operator: "array_contains", type: "select", value: null},
    {name: "outletUrl", operator: "contains", type: "string", value: ""},
    {name: "outletCirculation", operator: "contains", type: "string", value: ""},
    {name: "outletOnlineUniqueUsers", operator: "contains", type: "string", value: ""},
    {name: "desks", operator: "array_contains", type: "select", value: null},
    {name: "sectors", operator: "array_contains", type: "select", value: null},
    {name: "email", operator: "contains", type: "string", value: ""},
    {name: "phonePrimary", operator: "contains", type: "string", value: ""},
    {name: "phoneSecondary", operator: "contains", type: "string", value: ""},
    {name: "phoneMobile", operator: "contains", type: "string", value: ""},
    {name: "twitter", operator: "contains", type: "string", value: ""},
    {name: "twitterFollowers", operator: "contains", type: "string", value: ""},
    {name: "address", operator: "contains", type: "string", value: ""},
    {name: "addressPremise", operator: "contains", type: "string", value: ""},
    {name: "addressRoute", operator: "contains", type: "string", value: ""},
    {name: "addressLocality", operator: "contains", type: "string", value: ""},
    {name: "addressSublocality", operator: "contains", type: "string", value: ""},
    {name: "addressPostCode", operator: "contains", type: "string", value: ""},
    {name: "addressCountry", operator: "contains", type: "string", value: ""},
    {name: "extraInfo", operator: "contains", type: "string", value: ""},
    {name: "authorLists", operator: "array_contains", type: "select", value: null},
];

const arrayChipRender = ({value}: { value: string[] }) => <div>{value.map(outlet => <Chip label={outlet}/>)}</div>;

export const getColumns = async () => {
    const filters = await getAudienceAnalysisFilters();

    if (!filters) {
        return [];
    }

    const {sectors, jobTitles, outlets, outletTypes, desks, authorLists} = filters;

    // TODO: desks, authorLists

    return [
        {name: "firstName", header: "First name"},
        {name: "lastName", header: "Last name"},
        {
            name: "jobTitle",
            header: "Job title",
            render: arrayChipRender,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: jobTitles.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((c: string) => {
                    return {id: c, label: c}
                }),
            }
        },
        {
            name: "outlet",
            header: "Outlet",
            render: arrayChipRender,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: outlets.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((c: string) => {
                    return {id: c, label: c}
                }),
            }
        },
        {
            name: "outletType",
            header: "Outlet type",
            render: arrayChipRender,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: outletTypes.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((c: string) => {
                    return {id: c, label: c}
                }),
            }
        },
        {name: "outletUrl", header: "Outlet URL"},
        {name: "outletCirculation", header: "Outlet circulation"},
        {name: "outletOnlineUniqueUsers", header: "Outlet online unique users"},
        {
            name: "desks",
            header: "Desks",
            render: arrayChipRender,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: desks.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((c: string) => {
                    return {id: c, label: c}
                }),
            }
        },
        {
            name: "sectors",
            header: "Sectors",
            render: arrayChipRender,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: sectors.filter((a: string | null) => !!a).sort((a: string, b: string) => a.localeCompare(b)).map((c: string) => {
                    return {id: c, label: c}
                }),
            }
        },
        {name: "email", header: "Email"},
        {name: "phonePrimary", header: "Phone primary"},
        {name: "phoneSecondary", header: "Phone secondary"},
        {name: "phoneMobile", header: "Phone mobile"},
        {name: "twitter", header: "Twitter"},
        {name: "twitterFollowers", header: "Twitter followers"},
        {name: "address", header: "Address"},
        {name: "addressPremise", header: "Address premise"},
        {name: "addressRoute", header: "Address route"},
        {name: "addressLocality", header: "Address locality"},
        {name: "addressSublocality", header: "Address sublocality"},
        {name: "addressPostCode", header: "Address postcode"},
        {name: "addressCountry", header: "Address country"},
        {name: "extraInfo", header: "Extra info"},
        {
            name: "authorLists",
            header: "Author Lists",
            render: arrayChipRender,
            filterEditor: SelectFilter,
            filterEditorProps: {
                multiple: true,
                wrapMultiple: false,
                dataSource: authorLists.map((c: string) => {
                    return {id: c, label: c}
                }),
            }
        },
    ];
}

export const columns = [
    {name: "firstName", header: "First name"},
    {name: "lastName", header: "Last name"},
    {name: "jobTitle", header: "Job title", render: arrayChipRender},
    {
        name: "outlet", header: "Outlet", render: arrayChipRender, filterEditor: SelectFilter, filterEditorProps: {
            multiple: true,
            wrapMultiple: false,
            dataSource: ['London', 'New York City', 'Los Angeles', 'San Francisco', 'Boston', 'Baltimore', 'Washington'].map(c => {
                return {id: c, label: c}
            }),
        }
    },
    {name: "outletType", header: "Outlet type", render: arrayChipRender},
    {name: "outletUrl", header: "Outlet URL"},
    {name: "outletCirculation", header: "Outlet circulation"},
    {name: "outletOnlineUniqueUsers", header: "Outlet online unique users"},
    {name: "desks", header: "Desks", render: arrayChipRender},
    {name: "sectors", header: "Sectors", render: arrayChipRender},
    {name: "email", header: "Email"},
    {name: "phonePrimary", header: "Phone primary"},
    {name: "phoneSecondary", header: "Phone secondary"},
    {name: "phoneMobile", header: "Phone mobile"},
    {name: "twitter", header: "Twitter"},
    {name: "twitterFollowers", header: "Twitter followers"},
    {name: "address", header: "Address"},
    {name: "addressPremise", header: "Address premise"},
    {name: "addressRoute", header: "Address route"},
    {name: "addressLocality", header: "Address locality"},
    {name: "addressSublocality", header: "Address sublocality"},
    {name: "addressPostCode", header: "Address postcode"},
    {name: "addressCountry", header: "Address country"},
    {name: "extraInfo", header: "Extra info"},
    {name: "authorLists", header: "Author lists", render: arrayChipRender},
];
