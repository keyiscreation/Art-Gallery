import React from "react";

import AdminPanel from "@/components/AdminPanel";
import ProtectedRoute from "@/components/Layouts/ProtectedRoute";

const AdminPanelPage = () => {
  return (
    <>
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    </>
  );
};

export default AdminPanelPage;
