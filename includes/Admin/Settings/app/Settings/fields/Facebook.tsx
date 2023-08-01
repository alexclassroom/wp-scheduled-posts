import classNames from 'classnames';
import { useBuilderContext } from 'quickbuilder';
import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import { SweetAlertDeleteMsg } from '../ToasterMsg';
import { socialProfileRequestHandler } from '../helper/helper';
import ApiCredentialsForm from './Modals/ApiCredentialsForm';
import SocialModal from './Modals/SocialModal';
import MainProfile from './utils/MainProfile';
import SelectedProfile from './utils/SelectedProfile';
import ViewMore from './utils/ViewMore';

const Facebook = (props) => {
  const builderContext = useBuilderContext();
  const [apiCredentialsModal, setApiCredentialsModal] = useState(false);
  const [platform, setPlatform] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(props?.value);
  const [selectedProfileViewMore, setSelectedProfileViewMore] = useState(false);
  const [profileStatus, setProfileStatus] = useState(
    builderContext?.savedValues?.facebook_profile_status
  );

  // Open and Close API credentials modal
  const openApiCredentialsModal = (accountType) => {
    localStorage.setItem('account_type', accountType);
    setPlatform('facebook');
    setApiCredentialsModal(true);
  };
  const closeApiCredentialsModal = () => {
    setApiCredentialsModal(false);
  };

  // Handle profile & selected profile status onChange event
  const handleProfileStatusChange = (event) => {
    setProfileStatus(event.target.checked);
    if (event.target.checked == false) {
      const changeProfileStatus = selectedProfile.map((selectedItem) => {
        return {
          ...selectedItem,
          status: false,
        };
      });
      setSelectedProfile(changeProfileStatus);
    }
  };
  const handleSelectedProfileStatusChange = (item, event) => {
    if (event.target.checked) {
      setProfileStatus(true);
    }
    if (profileStatus == true) {
      const changeSelectedProfileStatus = selectedProfile.map(
        (selectedItem) => {
          if (selectedItem.id === item.id) {
            return {
              ...selectedItem,
              status: event.target.checked,
            };
          }
          return selectedItem;
        }
      );
      setSelectedProfile(changeSelectedProfileStatus);
    }
  };

  const handleDeleteSelectedProfile = (item) => {
    SweetAlertDeleteMsg({ item }, deleteSelectedProfile);
  };
  const deleteSelectedProfile = (item) => {
    const updateSelectedProfile = selectedProfile.filter(
      (selectedItem) => selectedItem.id !== item.id
    );
    setSelectedProfile(updateSelectedProfile);
  };
  // Save selected profile data
  useEffect(() => {
    builderContext.setFieldValue([props.name], selectedProfile);
  }, [selectedProfile]);

  // Save profile status data
  let { onChange } = props;
  useEffect(() => {
    onChange({
      target: {
        type: 'checkbox-select',
        name: 'facebook_profile_status',
        value: profileStatus,
      },
    });
  }, [profileStatus]);

  return (
    <div
      className={classNames(
        'wprf-control',
        'wprf-social-profile',
        `wprf-${props.name}-social-profile`,
        props?.classes
      )}>
      <div className="social-profile-card">
        <div className="main-profile">
          <MainProfile
            props={props}
            handleProfileStatusChange={handleProfileStatusChange}
            profileStatus={profileStatus}
            openApiCredentialsModal={openApiCredentialsModal}
          />
        </div>
        <div className="selected-profile">
          {selectedProfile &&
            selectedProfile?.slice(0, 1)?.map((item, index) => (
              <div
                className="selected-facebook-wrapper"
                key={index}>
                <SelectedProfile
                  platform={'facebook'}
                  item={item}
                  handleSelectedProfileStatusChange={
                    handleSelectedProfileStatusChange
                  }
                  handleDeleteSelectedProfile={handleDeleteSelectedProfile}
                  handleEditSelectedProfile={''}
                />
              </div>
            ))}
          {selectedProfile && selectedProfile.length > 1 && (
            <ViewMore setSelectedProfileViewMore={setSelectedProfileViewMore} />
          )}
        </div>
      </div>
      {/* API Credentials Modal  */}
      <Modal
        isOpen={apiCredentialsModal}
        onRequestClose={closeApiCredentialsModal}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        className="modal_wrapper">
        <button
          className="close-button"
          onClick={closeApiCredentialsModal}>
          <i className="wpsp-icon wpsp-close"></i>
        </button>
        <ApiCredentialsForm
          props={props}
          platform={platform}
          requestHandler={socialProfileRequestHandler}
        />
      </Modal>

      {/* Profile Data Modal  */}
      {/* @ts-ignore */}
      <SocialModal
        setSelectedProfile={setSelectedProfile}
        props={props}
        type="facebook"
      />
      <Modal
        isOpen={selectedProfileViewMore}
        onRequestClose={true}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        className="modal_wrapper">
        <button
          className="close-button"
          onClick={() => setSelectedProfileViewMore(false)}>
          <i className="wpsp-icon wpsp-close"></i>
        </button>
        <div className="selected-profile">
          {selectedProfile &&
            selectedProfile?.map((item, index) => (
              <div
                className="selected-facebook-wrapper"
                key={index}>
                <SelectedProfile
                  platform={'facebook'}
                  item={item}
                  handleSelectedProfileStatusChange={
                    handleSelectedProfileStatusChange
                  }
                  handleDeleteSelectedProfile={handleDeleteSelectedProfile}
                  handleEditSelectedProfile={''}
                />
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default Facebook;
