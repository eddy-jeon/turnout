import { getConfig, setTarget } from './config';
import { setProxyTarget } from './proxy';
// @ts-ignore
const { Select, Input } = require('enquirer');
import chalk from 'chalk';

export async function tuiLoop() {
  while (true) {
    const config = getConfig();
    console.clear();
    console.log(chalk.green('🛡️  Beyond The Wall - Dynamic API Proxy'));
    console.log('현재 타겟:', chalk.yellow(config.target));
    console.log();
    const actionPrompt = new Select({
      name: 'action',
      message: '동작을 선택하세요',
      choices: ['타겟 주소 변경', '최근 주소에서 선택', '종료'],
    });
    const action = await actionPrompt.run();
    if (action === '타겟 주소 변경') {
      const inputPrompt = new Input({
        message: '새 타겟 주소를 입력하세요',
        initial: config.target,
      });
      const newTarget = await inputPrompt.run();
      setTarget(newTarget);
      setProxyTarget(newTarget);
    } else if (action === '최근 주소에서 선택') {
      const selectPrompt = new Select({
        name: 'recent',
        message: '최근 사용한 주소',
        choices: config.recent,
      });
      const selected = await selectPrompt.run();
      setTarget(selected);
      setProxyTarget(selected);
    } else if (action === '종료') {
      console.log('종료합니다.');
      process.exit(0);
    }
  }
}
