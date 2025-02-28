import { useState } from "react";

const useAclHandler = (initialAcls) => {
  const [acls, setAcls] = useState(initialAcls);
  const [active, setActive] = useState(false);

  const handleAclSwitch = (e, f, key) => {
    if (f === null && key === null) {
      setActive(e);
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl: feat.acl.map((acl) => ({
            ...acl,
            value: e,
          })),
        }))
      );
      return;
    }

    // Handle specific ACL updates
    const updateAclsWithKeys = (keyArr) => {
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl:
            f === feat.feature
              ? feat.acl.map((acl) => ({
                  ...acl,
                  value: keyArr.includes(acl.key) ? e : acl.value,
                }))
              : feat.acl,
        }))
      );
    };

    // Handle different cases based on key and value
    if (key === "is_create" && e === true) {
      updateAclsWithKeys(["is_create", "is_view"]);
    } else if (key === "is_update" && e === true) {
      updateAclsWithKeys(["is_create", "is_view", "is_update"]);
    } else if (key === "is_delete" && e === true) {
      updateAclsWithKeys(["is_view", "is_update", "is_delete"]);
    } else if (key === "is_assign_employee" && e === true) {
      updateAclsWithKeys(["is_view", "is_assign_employee"]);
    } else if (key === "is_process" && e === true) {
      updateAclsWithKeys(["is_view", "is_process"]);
    } else if (key === "is_export" && e === true) {
      updateAclsWithKeys(["is_view", "is_export"]);
    } else if (key === "is_hire" && e === true) {
      updateAclsWithKeys(["is_view", "is_hire"]);
    } else if (
      key === "is_view" &&
      e === false &&
      acls.some(
        (feat) =>
          feat.feature === f &&
          feat.acl.some((acl) => acl.key === "is_view" && acl.value === true)
      )
    ) {
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl:
            f === feat.feature
              ? feat.acl.map((acl) => ({
                  ...acl,
                  value: e,
                }))
              : feat.acl,
        }))
      );
    } else {
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl:
            f === feat.feature
              ? feat.acl.map((acl) => ({
                  ...acl,
                  value: key === acl.key ? e : acl.value,
                }))
              : feat.acl,
        }))
      );
    }
  };

  return {
    acls,
    active,
    handleAclSwitch,
  };
};

export default useAclHandler;
