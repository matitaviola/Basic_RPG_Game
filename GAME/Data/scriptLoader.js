/* 
This contains the functions used to load all the other scripts in order to have an increased modularity,
while also avoiding the need to have an exaggeratedly long list of  scripts in the HTML index file.
Why am I doing this instead of using something like modules, nodeJs, etc? Just to see if I can.
*/
function loadScript(src, callback) {
  const s = document.createElement("script");
  s.src = src;
  s.onload = callback;
  document.head.appendChild(s);
}

function loadSequentially(sources, finalCallback) {
  let i = 0;

  function next() {
    if (i >= sources.length) {
      finalCallback();
      return;
    }

    const s = document.createElement("script");
    s.src = sources[i++];
    s.onload = next;
    document.head.appendChild(s);
  }

  next();
}