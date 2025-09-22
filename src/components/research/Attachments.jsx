import { motion } from "framer-motion";
import { Download } from "lucide-react";

const Attachments = ({ attachments }) => {
  if (!attachments.length) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Attachments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {attachments.map((file, i) => (
          <motion.a
            key={i}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md transition"
          >
            <div className="text-2xl mr-3">
              {file.type?.startsWith("image/") && "🖼️"}
              {file.type === "application/pdf" && "📄"}
              {file.type?.includes("word") && "📝"}
              {file.type?.includes("csv") && "📊"}
              {"📎"}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <Download className="h-4 w-4 text-gray-400" />
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Attachments;