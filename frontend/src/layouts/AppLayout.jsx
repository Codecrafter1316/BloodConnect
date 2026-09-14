import AppShell from '../components/layout/AppShell';

const AppLayout = ({ role, children }) => <AppShell role={role}>{children}</AppShell>;

export default AppLayout;
