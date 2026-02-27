export const getDashboardRoute = (role) => {
    switch (role) {
        case 'WORKER':
            return '/worker';
        case 'CONTRACTOR':
            return '/contractor';
        case 'CLIENT':
        default:
            return '/client';
    }
};
