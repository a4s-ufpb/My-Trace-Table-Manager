const languageTypeDefinitions = {
    python: {
        int: /^-?\d+$/,
        float: /^-?\d+\.\d+$/,
        bool: /^(True|False)$/,
        str: /.*/ 
    },
    java: {
        int: /^-?\d+$/,
        double: /^-?\d+\.\d+$/,
        boolean: /^(true|false)$/,
        String: /.*/
    }
};

export const getValidTypesForValue = (value, language = 'python') => {
    const validTypes = [];
    const typeDefs = languageTypeDefinitions[language];
    const defaultString = language === 'java' ? 'String' : 'str';

    if (!value || value.trim() === '') {
        return Object.keys(typeDefs);
    }

    for (const type in typeDefs) {
        if (type === defaultString) continue;

        if (typeDefs[type].test(value)) {
            validTypes.push(type);
        }
    }
    
    validTypes.push(defaultString);

    return validTypes;
};

const typeNormalizationMap = {
    'str': 'string',
    'String': 'string',
    'bool': 'boolean',
    'boolean': 'boolean',
    'int': 'int',
    'float': 'float',
    'double': 'double'
}

export const normalizeTypeTableForAPI = (typeTable) => {
    if (!typeTable) return [];
    return typeTable.map(row =>
        row.map(cellType => {
            if (cellType === "#") return "#";
            return typeNormalizationMap[cellType] || cellType;
        })
    );
};