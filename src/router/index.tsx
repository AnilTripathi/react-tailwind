
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import SuspenseFallback from '@/components/SuspenseFallback';

const Layout = lazy(() => import('../layout/layout'));
const Home = lazy(() => import('../pages/home'));
const UserPage = lazy(() => import('../pages/user'));
const About = lazy(() => import('../pages/about'));
const NotFound = lazy(() => import('../pages/notfound'));
const MyToDosPage = lazy(() => import('../pages/mytodo/MyToDo'));


const AppRouter = () => {
  return (
    <BrowserRouter>
     <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="users" element={<UserPage />} />
            <Route path="about" element={<About />} />
            <Route path="mytodo" element={<MyToDosPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter