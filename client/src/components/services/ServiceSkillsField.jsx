import { Plus, X } from "lucide-react";
import React from "react";

const ServiceSkillsField = (params) => {
  const { formData, updateSkill, removeSkill, addSkill } = params;
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Skills</label>
      <div className="space-y-2">
        {formData.skills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Skill"
            />
            {formData.skills.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="ml-2 text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="w-full flex items-center justify-center text-blue-500 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>
    </div>
  );
};

export default ServiceSkillsField;
