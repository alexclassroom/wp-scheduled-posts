import React, { useState,useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { default as ReactSelect } from "react-select";
import PinterestSectionSelect from '../utils/PinterestSectionSelect';
import { selectStyles } from '../../helper/styles';

export default function Pinterest({ platform, data, boards,fetchSectionData,noSection,addProfileToggle,savedProfile,singlePinterestBoard }) {
    let boardOptions = boards?.map((board) => {
      return {
        label: board.name || board.id,
        value: board.id,
      };
    });
    
    const [defaultSection, setDefaultSection] = useState(noSection ? [noSection] : []);
    const [editDefaultSection,setEditDefaultSection]  = useState( singlePinterestBoard?.defaultSection ?? [] );
    const [sectionOptions, setSectionOptions] = useState([noSection]);
    const [singleBoardOptions, setSingleBoardOptions] = useState([]);

    useEffect( () => {
      if( singlePinterestBoard ) {
        setSingleBoardOptions([singlePinterestBoard?.default_board_name]);
        setEditDefaultSection([singlePinterestBoard?.defaultSection]);
      }
    },[singlePinterestBoard] );

    return (
        <>
          <div className="wpsp-modal-social-platform">
            { !singlePinterestBoard && data?.map ( ( item, index ) => (
              <div className="profile-info">
                <div className='author-details'>
                  <img src={item?.thumbnail_url} alt={item?.name} />
                  <h3>{item?.name}</h3>
                </div>
                <ul>
                  {boardOptions.map((board, board_index) => {
                    return (<li key={board_index}>
                      <div className="item-content">
                        <h4 className="entry-title">{board?.label}</h4>
                        <div className="control pinterest-select">
                          <PinterestSectionSelect
                            noSection={noSection}
                            fetchSectionData={fetchSectionData}
                            board={board}
                            item={item}
                            setSectionOptions={setSectionOptions}
                            sectionOptions={sectionOptions}
                            setBoardDefaultSection={setDefaultSection}
                            prevDefaultSection={defaultSection}
                          />
                        </div>
                        <input
                            type='checkbox'
                            onChange={ (event) => {
                              let selectedBoardSection = defaultSection.find((item) => item.board === board?.value)
                              addProfileToggle(
                                item,
                                selectedBoardSection,
                                event,
                                board,
                              )
                              }
                            }
                        />
                      </div>
                    </li>);
                  })}
                <button
                  type="submit"
                  className="wpsp-modal-save-account"
                  onClick={(event) => {
                    savedProfile(event)
                  }}
                  >{ __( 'Save','wp-scheduled-posts' ) }</button>
                  </ul>
              </div>
            ) )}
            { singlePinterestBoard && (
              <div className="profile-info">
                <div className='author-details'>
                  <img src={singlePinterestBoard?.thumbnail_url} alt={singlePinterestBoard?.name} />
                  <h3>{singlePinterestBoard?.name}</h3>
                </div>
                <ul>
                  {singleBoardOptions?.map((board, board_index) => (
                    <li key={board_index}>
                      <div className="item-content">
                        <h4 className="entry-title">{board?.label}</h4>
                        <div className="control pinterest-select">
                          <ReactSelect
                            value={ editDefaultSection }
                            onMenuOpen={() =>
                              fetchSectionData(
                                board?.value,
                                singlePinterestBoard,
                                setSectionOptions
                              )
                            }
                            styles={selectStyles}
                            className='main-select'
                            onChange={(event) => setEditDefaultSection(event)}
                            options={sectionOptions}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                <button
                  type="submit"
                  className="wpsp-modal-save-account"
                  onClick={(event) => {
                    savedProfile(event)
                    console.log('save-event',editDefaultSection);
                    
                    addProfileToggle(
                      singlePinterestBoard,
                      editDefaultSection,
                      'save-edit',
                      singlePinterestBoard?.default_board_name,
                    )
                  }}
                  >{ __( 'Save','wp-scheduled-posts' ) }</button>
                  </ul>
              </div>
            ) }
            
          </div>
        </>
    )
}
