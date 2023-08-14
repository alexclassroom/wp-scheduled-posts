import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { useBuilderContext } from 'quickbuilder';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
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
  const [cachedStatus, setCashedStatus] = useState({});
  const [profileStatus, setProfileStatus] = useState(
    builderContext?.savedValues?.facebook_profile_status
    );
  const [activeStatusCount,setActiveStatusCount] = useState(0);
  
  // @ts-ignore
  const is_pro = wpspSettingsGlobal?.pro_version ? true : false;
  

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
    const changeProfileStatus = selectedProfile.map((selectedItem) => {
      if (!event.target.checked) {
        setCashedStatus((prevStatus) => {
          return { ...prevStatus, [selectedItem.id]: selectedItem?.status };
        });
        return {
          ...selectedItem,
          status: false,
        };
      } else {
        return {
          ...selectedItem,
          status : (cachedStatus?.[selectedItem.id] == undefined) ?  false : cachedStatus?.[selectedItem.id], 
        };
      }
    });
    setSelectedProfile(changeProfileStatus);
  };
  
  const handleSelectedProfileStatusChange = (item, event) => {
    if (event.target.checked) {
      setProfileStatus(true);
    }
    setCashedStatus((prevStatus) => {
      if( is_pro ) {
        return { ...prevStatus, [item.id]: event.target.checked };
      }else{
        return { [item.id]: event.target.checked };
      }
    });
    if ( is_pro ) {
      const updatedData = selectedProfile.map((selectedItem) => {
        if (selectedItem.id === item.id) {
          return {
            ...selectedItem,
            status: event.target.checked,
          };
        }
        return selectedItem;
      });
      setSelectedProfile(updatedData);
    }else{
      if( activeStatusCount <= 1 ) {
        let currentStatus = event.target.checked;
        if( activeStatusCount === 1 && currentStatus ) {
          Swal.fire({
            title: __('Are you sure?','wp-scheduled-posts'),
            text: __('Enabling this profile will deactivate other profile automatically.','wp-scheduled-posts'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: '<i class="wpsp-icon wpsp-close"></i>',
            confirmButtonText: __('Yes, Enable it!', 'wp-scheduled-posts'),
          }).then((result) => {
            if (result.isConfirmed) {
                const updatedData = selectedProfile.map((selectedItem) => {
                  return {
                    ...selectedItem,
                    status: selectedItem.id === item.id ? currentStatus : false,
                  };
              });
              setSelectedProfile(updatedData);
            }
          })
        }else{
          const updatedData = selectedProfile.map((selectedItem) => {
              return {
                ...selectedItem,
                status: selectedItem.id === item.id ? currentStatus : false,
              };
          });
          setSelectedProfile(updatedData);
        }
      }
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
    let count = 0;
    if( selectedProfile ) {
      selectedProfile.forEach(element => {
        if( element.status ) {
            count++;
        }
        setActiveStatusCount( count );
      });
    }
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
  let selectedProfileData = [];
  if (selectedProfile && selectedProfileViewMore) {
    selectedProfileData = selectedProfile;
  } else if (selectedProfile && !selectedProfileViewMore) {
    selectedProfileData = selectedProfile.slice(0, 2);
  }
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
          {(!selectedProfile || selectedProfile.length == 0) && (
            <img
              className="empty-image"
              /* @ts-ignore */
              src={`${wpspSettingsGlobal?.image_path}EmptyCard.svg`}
              alt="mainLogo"
            />
          )}
          <div className="selected-facebook-scrollbar">
            {selectedProfile &&
              selectedProfileData.map((item, index) => (
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
          { ( !selectedProfileViewMore && selectedProfile && selectedProfile.length >= 3) && (
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
        profileStatus={profileStatus}
      />
    </div>
  );
};

export default Facebook;
