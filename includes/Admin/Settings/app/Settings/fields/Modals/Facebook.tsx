import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import ProAlert from '../utils/ProAlert';
export default function Facebook({ page, group, addProfileToggle,savedProfile }) {
    const [isErrorMessage, setIsErrorMessage] = useState(false);
    return (
        <>
            <div className='wpsp-modal-social-platform'>
                <ul>
                    {page.length > 0 && (
                        <li>{__('Pages:', 'wp-scheduled-posts')} </li>
                    )}
                    {page.map((item, index) => (
                        <li id={'facebook_page_' + index} key={index}>
                            <div className='item-content'>
                                <div className='entry-thumbnail'>
                                    <img
                                        src={item.thumbnail_url}
                                        alt='logo'
                                    />
                                    <h4 className='entry-title'>
                                        {item.name}
                                    </h4>
                                </div>
                                <div className='control'>
                                    <input
                                        type='checkbox'
                                        onChange={(e) =>
                                            addProfileToggle(
                                                item,
                                                index,
                                                e
                                            )
                                        }
                                    />
                                    <div></div>
                                </div>
                            </div>
                        </li>
                    ))}

                    {group.length > 0 && (
                        <li>{__('Group:', 'wp-scheduled-posts')} </li>
                    )}

                    {group.map((item, index) => (
                        <li id={'facebook_group_' + index} key={index}>
                            <div className='item-content'>
                                <div className='entry-thumbnail'>
                                    <img
                                        src={item.thumbnail_url}
                                        alt='logo'
                                    />
                                    <h4 className='entry-title'>
                                        {item.name}
                                    </h4>
                                </div>
                                <div className='control'>
                                    <input
                                        type='checkbox'
                                        onChange={(e) =>
                                            addProfileToggle(
                                                item,
                                                index,
                                                e
                                            )
                                        }
                                    />
                                    <div></div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <button
                type="submit"
                className="wpsp-modal-save-account"
                onClick={(event) => {
                  event.preventDefault();
                  savedProfile(event)
                }}
                >{ __( 'Save','wp-scheduled-posts' ) }</button>
            </div>
        </>
    )
}
