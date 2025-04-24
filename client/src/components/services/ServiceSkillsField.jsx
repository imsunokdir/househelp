import { Plus, X, Sparkles } from "lucide-react";
import React from "react";

const ServiceSkillsField = ({
  formData,
  updateSkill,
  removeSkill,
  addSkill,
}) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <label className="flex items-center text-sm font-semibold text-gray-800">
          <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
          Skills
        </label>
        <span className="text-xs text-gray-400">
          {formData.skills.length} skill
          {formData.skills.length !== 1 ? "s" : ""} added
        </span>
      </div>

      <div className="space-y-3">
        {formData.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <div className="relative flex-1">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="w-full px-4 py-2.5 pl-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200"
                placeholder="Enter a skill..."
              />
              <span className="absolute left-3 top-2.5 text-xs font-medium text-gray-400 opacity-0">
                #{index + 1}
              </span>
            </div>

            {/* Removed the condition so X always shows */}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              aria-label="Remove skill"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSkill}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-50 border border-dashed border-indigo-300 rounded-md text-indigo-600 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200 mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>

        {formData.skills.length === 0 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Add skills that showcase your expertise
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceSkillsField;
