const han1Process = {};

han1Process.restartParent = function restartParent(pid) {
  pid = pid ? pid : process.ppid;

  console.log(pid);

  // return process.kill(pid)
}

module.exports = han1Process;
