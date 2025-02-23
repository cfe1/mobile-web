import React, { useState, useEffect } from "react";
import DrawerSearchInput from "App/components/Form/DrawerSearchInput";
import { SingleRecipient } from "./SingleRecipient";
import NoRecipients from "App/assets/icons/NoRecipients.svg";
export const AllRecipients = ({ allRecipients, setAllRecipients }) => {
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [filteredRecipients, setFilteredRecipients] = useState(allRecipients);

  const hasFacility = (facilityListing, search) => {
    return facilityListing?.some((facility) =>
      facility?.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
    setFilteredRecipients(
      allRecipients.filter(
        ({ name, email, facilityListing }) =>
          name.toLowerCase().includes(search.toLowerCase()) ||
          email.toLowerCase().includes(search.toLowerCase()) ||
          hasFacility(facilityListing, search)
      )
    );
  }, [search, allRecipients]);

  return (
    <>
      <div className="horizontal-divider p-20 rounded-4">
        <div className="flex justify-between mb-10 items-center">
          <span className="text-16 text-600">Pdf Recipients</span>
          <DrawerSearchInput
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            label={`Search by Email, Name or Facility`}
            widthClass="search"
            disabled={editId !== null}
            setSearch={setSearch}
          />
        </div>

        <div className="flex flex-col gap-12 mt-20 max-h">
          {filteredRecipients?.length > 0 ? (
            filteredRecipients.map((recipient, rIndex) => {
              return (
                <SingleRecipient
                  recipient={recipient}
                  rIndex={rIndex}
                  setAllRecipients={setAllRecipients}
                  allRecipients={allRecipients}
                  editId={editId}
                  setEditId={setEditId}
                />
              );
            })
          ) : (
            <>
              <img src={NoRecipients} alt="No recipients" className="max-h" />
            </>
          )}
        </div>
      </div>
    </>
  );
};
