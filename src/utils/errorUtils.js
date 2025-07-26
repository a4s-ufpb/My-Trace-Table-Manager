export function formatFieldErrors(responseData) {
    if (responseData?.fieldMessageList && Array.isArray(responseData.fieldMessageList)) {
        return responseData.fieldMessageList.map(
            fieldError => `- ${fieldError.message}`
        );
    }
    return responseData?.message || "Erro inesperado";
}