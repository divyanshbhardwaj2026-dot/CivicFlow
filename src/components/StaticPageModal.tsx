import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface StaticPageModalProps {
  pageType: string;
  onClose: () => void;
}

export const StaticPageModal: React.FC<StaticPageModalProps> = ({ pageType, onClose }) => {
  const getPageContent = () => {
    switch (pageType) {
      case 'Privacy Policy':
      case 'Privacy & Data Ethics':
        return {
          title: 'Privacy Policy & Data Ethics',
          content: (
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>Welcome to the CivicFlow Privacy Policy. Your privacy is critically important to us.</p>
              <h3 className="font-bold text-slate-900 mt-6">1. Data Collection</h3>
              <p>We collect information you provide directly to us when you submit a grievance, including your name, contact details, and location data related to the incident.</p>
              <h3 className="font-bold text-slate-900 mt-6">2. Data Usage</h3>
              <p>The collected data is strictly used for the purpose of municipal governance, grievance redressal, and civic administration.</p>
              <h3 className="font-bold text-slate-900 mt-6">3. Data Protection</h3>
              <p>We employ enterprise-grade security measures to protect your data. Personal identifiable information (PII) is anonymized for public dashboards.</p>
            </div>
          )
        };
      case 'Terms of Service':
      case 'Citizen Charter':
        return {
          title: 'Terms of Service & Citizen Charter',
          content: (
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>By accessing the CivicFlow platform, you agree to abide by these Terms of Service.</p>
              <h3 className="font-bold text-slate-900 mt-6">1. Citizen Rights and Responsibilities</h3>
              <p>Citizens have the right to report civic issues and expect a timely resolution based on predefined SLAs. False reporting or misuse of the platform is strictly prohibited.</p>
              <h3 className="font-bold text-slate-900 mt-6">2. Platform Usage</h3>
              <p>This platform is intended for official civic grievance redressal. Any attempt to disrupt the service or gain unauthorized access will be met with legal action.</p>
            </div>
          )
        };
      case 'Accessibility':
      case 'Open Data API':
        return {
          title: pageType === 'Open Data API' ? 'Open Data API' : 'Accessibility',
          content: (
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              {pageType === 'Open Data API' ? (
                <>
                  <p>CivicFlow believes in transparent governance. Our Open Data API allows researchers and citizens to access anonymized civic data.</p>
                  <h3 className="font-bold text-slate-900 mt-6">API Access</h3>
                  <p>API documentation and access keys can be requested through the municipal IT department. Rate limits apply to ensure system stability.</p>
                </>
              ) : (
                <>
                  <p>We are committed to making CivicFlow accessible to all citizens, including those with disabilities.</p>
                  <h3 className="font-bold text-slate-900 mt-6">Standards</h3>
                  <p>Our platform is designed to meet WCAG 2.1 AA standards, featuring high-contrast modes, screen reader compatibility, and keyboard navigation.</p>
                </>
              )}
            </div>
          )
        };
      case 'Help Desk':
      case '24x7 Help Desk':
        return {
          title: '24x7 Help Desk',
          content: (
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>Need assistance with CivicFlow? Our support team is here to help.</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                <p className="font-bold text-blue-900">National Civic Helpline</p>
                <p className="text-blue-800 text-lg mt-1">1800 11 0033</p>
                <p className="text-blue-700 mt-2 text-xs">Available 24/7 for emergency civic issues.</p>
              </div>
              <h3 className="font-bold text-slate-900 mt-6">Email Support</h3>
              <p>For technical issues with the portal, contact support@civicflow.gov</p>
            </div>
          )
        };
      default:
        return {
          title: 'Information',
          content: <p>Information not available.</p>
        };
    }
  };

  const { title, content } = getPageContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {content}
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
