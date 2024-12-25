import { EditProfileModalProps } from "@/types/ProfileModalProps";
import Button from "../ui/Button";

// Modal for profile edit
const EditProfileModal = ({
  userFields,
  formData,
  setFormData,
  onSave,
  saving,
  error,
}: EditProfileModalProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-2">
      <h3 className="sub-header">Edycja</h3>
      <div className="flex flex-col justify-center items-center gap-4 mt-4">
        <div className="flex flex-col justify-center items-center gap-2">
          {userFields.map((field, index) => (
            <input
              key={index}
              type={field.key === "email" ? "email" : "text"}
              className="input"
              placeholder={field.label}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
            />
          ))}
        </div>
        <Button
          className="border-2 border-button w-full"
          onClick={() => onSave()}
        >
          {saving ? "Zapisywanie..." : "Zapisz"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default EditProfileModal;
