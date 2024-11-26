import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const markCommit = async (daysAgo) => {
  const date = moment()
    .subtract(daysAgo, "days")
    .format();

  const data = {
    date: date,
  };

  return new Promise((resolve) => {
    jsonfile.writeFile(path, data, () => {
      simpleGit().add([path]).commit(date, { "--date": date }, async () => {
        await simpleGit().push();
        console.log(`[${moment().format('HH:mm:ss')}] Commit thứ ${commitCount++} đã được push - Ngày: ${date}`);
        resolve();
      });
    });
  });
};

let commitCount = 1;

const makeCommits = async () => {
  // Tạo commits cho 365 ngày
  for (let day = 365; day >= 0; day--) {
    const commitsToday = random.int(1, 10);
    console.log(`\n[${moment().format('HH:mm:ss')}] Ngày ${365 - day}: Bắt đầu tạo ${commitsToday} commits`);

    for (let i = 0; i < commitsToday; i++) {
      await markCommit(day);
      // Tạm dừng 1 giây giữa các commits để tránh quá tải
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`[${moment().format('HH:mm:ss')}] ✓ Hoàn thành ${commitsToday} commits cho ngày ${365 - day}`);
  }

  console.log(`\n[${moment().format('HH:mm:ss')}] 🎉 Đã hoàn thành tất cả commits!`);
};

console.log(`[${moment().format('HH:mm:ss')}] Bắt đầu quá trình tạo commits...`);
makeCommits().catch(error => {
  console.error(`[${moment().format('HH:mm:ss')}] Lỗi:`, error);
});
