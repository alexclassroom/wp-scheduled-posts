import React from 'react'
import { __ } from '@wordpress/i18n'
import { getFormatDateTime } from '../../helper/helper'

export default function SelectedProfile( { platform, item, handleSelectedProfileStatusChange, handleDeleteSelectedProfile, handleEditSelectedProfile } ) {
    
  return (
    <>
        <div className="profile-item" key={Math.random()}>
            <div className="profile-image">
                {/* @ts-ignore */}
                <img src={`${item?.thumbnail_url}`} alt={ __( item?.name,'wp-scheduled-posts' ) } />
            </div>
            <div className="profile-data">
                {
                    {
                        facebook: (
                            <span className='badge'>{ item.type ? item.type : __('Profile','wp-scheduled-posts') }</span>
                        ),
                        twitter: (
                            <span className='badge'>{ item.type ? item.type : __('Profile','wp-scheduled-posts') }</span>
                        ),
                        linkedin: (
                            <span className='badge'>{ item?.type == 'organization' ? __('Page','wp-scheduled-posts') : __('Profile','wp-scheduled-posts')  }</span>
                        ),
                        pinterest: (
                            <span className='badge'>{ item?.account_type ? __('Board','wp-scheduled-posts') : item?.type }</span>

                        ),
                    }[platform]
                }
                <h4> { platform == 'pinterest' ? item?.default_board_name?.label : item?.name }</h4>
                <span>{ item?.added_by?.replace(/^\w/, (c) => c.toUpperCase()) } { __('on','wp-scheduled-posts') } {getFormatDateTime(item?.added_date)}</span>
                <div className="action">
                    <div className="status">
                        <div className="switcher">
                            <input
                                id={item?.default_board_name?.value}
                                type='checkbox'
                                className="wprf-switcher-checkbox"
                                checked={item?.status}
                                onChange={(event) =>
                                    handleSelectedProfileStatusChange(item,event)
                                }
                            />
                            <label
                                className="wprf-switcher-label"
                                htmlFor={item?.default_board_name?.value}
                                style={{ background: item?.status && '#02AC6E' }}
                            >
                                <span className={`wprf-switcher-button`} />
                            </label>
                        </div>
                    </div>
                    { ( platform == 'pinterest' ) && (
                        <div className="edit-profile">
                            <button onClick={ () => handleEditSelectedProfile( item ) }>{ __('Edit','wp-scheduled-posts') }</button>
                        </div>
                    ) }
                    <div className="remove-profile">
                        <button onClick={ () => handleDeleteSelectedProfile( item ) }>{ __('Delete','wp-scheduled-posts') }</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
