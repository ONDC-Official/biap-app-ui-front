import React from 'react';

const requestMethods = [
  {
    slug: 'get',
    method: 'GET',
  },
  {
    slug: 'post',
    method: 'POST',
  },
  {
    slug: 'put',
    method: 'PUT',
  },
  {
    slug: 'patch',
    method: 'PATCH',
  },
  {
    slug: 'delete',
    method: 'DELETE',
  },
];

export default function UrlEditor({
  url,
  setUrl,
  reqMethod,
  setReqMethod,
  onInputSend,
}) {
  return (
    <>
      <form className='flex'>
        <select
          disabled
          className='px-4 py-2 border rounded-md border-gray-300 hover:border-primary focus:outline-none bg-gray-100'
          value={reqMethod}
          onChange={(e) => setReqMethod(e.target.value)}
        >
          {requestMethods.map((option) => (
            <option key={option.slug} value={option.method}>
              {option.method}
            </option>
          ))}
        </select>
        <input
          disabled
          className='ml-3 w-full px-4 py-2 border rounded-md border-gray-300 hover:border-primary focus:outline-primary'
          value={`${process.env.REACT_APP_BASE_URL}${url}`}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className='ml-3 px-6 py-2 rounded-md font-semibold text-white bg-primary hover:bg-primary '
          type='button'
          onClick={(e) => onInputSend(e)}
        >
          Send
        </button>
      </form>
    </>
  );
}
