export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getYearsOfService = (hireDate: string): number => {
    const hire = new Date(hireDate);
    const now = new Date();
    return now.getFullYear() - hire.getFullYear();
};