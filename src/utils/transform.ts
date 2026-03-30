import { BaseOptionType } from "antd/es/select";

export const enumToOptions = (
    enumValues: Record<string, string>,
): BaseOptionType[] => {
    return Object.entries(enumValues).map(([key, value]) => ({
        label: key,
        value: value,
    }));
};

export const specToOptions = (spec: { title: string; code: string }[]) =>
    spec.map((v) => ({ label: v.title, value: v.code }));

export const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
};
