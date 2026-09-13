import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { GalleryPage } from "./pages/GalleryPage";
import { GalleryPostPage } from "./pages/GalleryPostPage";
import { TalentsPage } from "./pages/TalentsPage";
import { TalentPostPage } from "./pages/TalentPostPage";
import { CvPage } from "./pages/CvPage";
import { CvFormPage } from "./pages/CvFormPage";
import { CvProfilePage } from "./pages/CvProfilePage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { fetchCurrentUser } from "./api/auth.api";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    fetchCurrentUser().then(setUser);
  }, [setUser]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:id" element={<GalleryPostPage />} />
        <Route path="/talents" element={<TalentsPage />} />
        <Route path="/talents/:id" element={<TalentPostPage />} />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/cv/me/edit" element={<CvFormPage />} />
        <Route path="/cv/:id" element={<CvProfilePage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </Layout>
  );
}