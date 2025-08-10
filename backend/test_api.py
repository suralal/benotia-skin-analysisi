import requests
import json
import time

# Test the skin analysis API
def test_analysis():
    url = "http://localhost:8000/v1/analysis"
    
    # Create simple landmarks (468 points)
    landmarks = [[100 + i, 100 + i, 0] for i in range(468)]
    
    # Prepare the multipart form data
    files = {'image': open('test_image.jpg', 'rb')}
    data = {'landmarks': json.dumps(landmarks)}
    
    print("Sending analysis request...")
    response = requests.post(url, files=files, data=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Analysis started successfully!")
        print(f"Job ID: {result['job_id']}")
        print(f"Status: {result['status']}")
        
        # Poll for results
        job_id = result['job_id']
        poll_url = f"http://localhost:8000/v1/analysis/{job_id}"
        
        print("\nPolling for results...")
        for i in range(10):  # Try up to 10 times
            time.sleep(2)
            poll_response = requests.get(poll_url)
            
            if poll_response.status_code == 200:
                poll_result = poll_response.json()
                print(f"Status: {poll_result['status']}")
                
                if poll_result['status'] == 'done':
                    print("✅ Analysis completed!")
                    print(f"Scores: {poll_result['scores']}")
                    print(f"Overlays: {poll_result['overlays']}")
                    break
                elif poll_result['status'] == 'error':
                    print(f"❌ Error: {poll_result['message']}")
                    break
            else:
                print(f"❌ Poll failed: {poll_response.status_code}")
                break
    else:
        print(f"❌ Request failed: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_analysis()
