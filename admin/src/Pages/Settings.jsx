import React, { useState, useEffect } from "react";
import api from "../api/axios";

const Settings = () => {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings")
        setSettings(res.data)
      } catch (err) {
        console.error(err)
      }
    };
    fetchSettings()
  }, [])

  const handleUpdateSettings = async (updatedSettings) => {
    try {
      const res = await api.put("/admin/settings", updatedSettings)
      setSettings(res.data)
    } catch (err) {
      console.error(err)
    }
  }
return (
  <div>
    <h2>Settings</h2>
    {settings ? (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const updatedSettings = {
              storeName: e.target.storeName.value,
              taxRate: e.target.taxRate.value,
            };
            handleUpdateSettings(updatedSettings);
          }}>
            
          <div>
            <label htmlFor="storeName">Store Name:</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              defaultValue={settings.storeName}
            />
          </div>
          <div>
            <label htmlFor="taxRate">Tax Rate (%):</label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              defaultValue={settings.taxRate}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    ) : (
      <p>Loading settings...</p>
    )}
  </div>
)
};

export default Settings;