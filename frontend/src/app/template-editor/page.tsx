'use client';

export default function TemplateEditorPage() {
  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Template Editor
        </h1>
        <p className="text-gray-600 mb-8">
          Canva-style template editor coming soon!
        </p>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <p className="text-sm text-gray-500">
            This feature is currently being optimized for production deployment.
            The template editor will be available once deployment is complete.
          </p>
        </div>
      </div>
    </div>
  );
}