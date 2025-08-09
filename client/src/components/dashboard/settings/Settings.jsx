import React, { useState } from "react";
import StoreInfo from "./StoreInfo";
import ThemeSetting from "./ThemeSetting";
import PaymentSetting from "./PaymentSetting";
import ShippingSetting from "./ShippingSetting";
import MaintenanceSetting from "./MaintenanceSetting";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const Settings = ({ theme, setTheme, maintenance, setMaintenance }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen py-5 px-3 md:px-2 lg:px-30 ">
      <div>
        <small className="text-xs">
          Customize your experience and preferences
        </small>
        <p
          className={`text-2xl font-bold ${
            theme ? "headerDark" : "headerLight"
          }`}
        >
          Settings
        </p>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center  w-full text-5xl bg-black/30 backdrop-blur-sm z-50">
          <AnimatedLogo className="text-orange-500" />
        </div>
      )}
      <div>
        <StoreInfo theme={theme} setLoading={setLoading} />
        <ThemeSetting theme={theme} setTheme={setTheme} />
        <PaymentSetting theme={theme} setLoading={setLoading} />
        <ShippingSetting theme={theme} setLoading={setLoading} />
        <MaintenanceSetting
          theme={theme}
          maintenance={maintenance}
          setMaintenance={setMaintenance}
        />
      </div>
    </div>
  );
};

export default Settings;
