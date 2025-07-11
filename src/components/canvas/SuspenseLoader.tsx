import { Html } from "@react-three/drei";

export default function HtmlLoader() {
    return (
        <Html center>
            <div className="spinner"></div>
            <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top: 4px solid #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </Html>
    )
}