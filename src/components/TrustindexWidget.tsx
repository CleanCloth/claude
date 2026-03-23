import { useEffect } from 'react';

export default function TrustindexWidget() {
  useEffect(() => {
    // Load Trustindex script if not already loaded
    const scriptId = 'trustindex-script';
    
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.trustindex.io/loader.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      className="trustindex-widget" 
      data-widget-id="google" 
      data-no-registration="true"
    >
      {/* Trustindex widget will load here */}
    </div>
  );
}
