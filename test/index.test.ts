import Home from '../pages/index'
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';





test('should render succesfully', () => { 
    render(<Home/>)
    expect(screen.getByText("Search")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search team")).toBeInTheDocument()
    // screen.debug()
 })


 test("should test for no Data", async ()=> {
    render(<Home/>)

    let searchButton = screen.getByText('Search');
    let searchInput = screen.getByPlaceholderText("Search team")
    fireEvent.change(searchInput,{ target:{value:"hi"}})
    fireEvent.click(searchButton);
    expect(screen.getByText("No Data Found")).toBeInTheDocument()
 })

  test('should test for  Data', async () => {
    const setTeams = jest.fn().mockReturnValue([{id:"asdjkasdf", name:"himeasdflj"}, {id:"asdfadsfoi", name:"heloo hi love hi"}])
    const useStateMock = (useState)=> [useState, setTeams]
    jest.spyOn(React, "useState").mockImplementation(useStateMock)
   
    render(<Home />);

    let searchButton = screen.getByText('Search');
    let searchInput = screen.getByPlaceholderText('Search team');
    fireEvent.change(searchInput, { target: { value: 'hi' } });
    fireEvent.click(searchButton);
    expect(setTeams).toHaveBeenCalledTimes(1)


  });