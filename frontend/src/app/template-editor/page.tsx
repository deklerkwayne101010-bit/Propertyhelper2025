'use client';

import { useState } from 'react';
import { TemplateEditor } from '@/components/template-editor/TemplateEditor';
import { SidebarTab } from '@/types/template-editor';

export default function TemplateEditorPage() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('elements');

  return (
    <div className="h-screen bg-gray-50">
      <TemplateEditor
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}